import { ApiResponse, isApiError, RestCountriesError } from '@/types/api';

const BASE_URL = 'https://api.restcountries.com/countries/v5';
const API_KEY = import.meta.env.VITE_RESTCOUNTRIES_API_KEY as string | undefined;

/**
 * Monta a URL final a partir do path e dos query params, ignorando
 * valores undefined/null/"" para não poluir a query string.
 */
function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

function mapStatusToFriendlyMessage(status: number): string {
  switch (status) {
    case 401:
      return 'Chave de API ausente ou inválida. Verifique a variável VITE_RESTCOUNTRIES_API_KEY no seu .env.';
    case 403:
      return 'Limite de requisições do plano gratuito atingido, ou recurso disponível apenas em planos pagos.';
    case 404:
      return 'Não encontramos o que você procurou.';
    case 429:
      return 'Muitas requisições em pouco tempo. Aguarde alguns segundos e tente novamente.';
    default:
      return 'Não foi possível carregar os dados agora. Tente novamente em instantes.';
  }
}

/**
 * Executa uma requisição GET contra a RestCountries v5, tratando tanto
 * falhas de rede quanto o envelope de erro { errors: [...] } da própria API.
 */
export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T[]> {
  if (!API_KEY) {
    throw new RestCountriesError(
      'Missing VITE_RESTCOUNTRIES_API_KEY',
      'A chave de API da RestCountries não foi configurada. Copie .env.example para .env e informe sua chave.',
    );
  }

  const url = buildUrl(path, params);
  let response: Response;

  try {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
  } catch {
    throw new RestCountriesError(
      'Network error while calling RestCountries API',
      'Não foi possível conectar à API. Verifique sua conexão com a internet.',
    );
  }

  let body: ApiResponse<T>;
  try {
    body = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new RestCountriesError(
      'Invalid JSON returned by RestCountries API',
      'A API retornou uma resposta inesperada. Tente novamente em instantes.',
    );
  }

  if (!response.ok || isApiError(body)) {
    const message = isApiError(body) ? body.errors.map((e) => e.message).join('; ') : response.statusText;
    throw new RestCountriesError(message, mapStatusToFriendlyMessage(response.status), response.status);
  }

  return body.data.objects;
}
