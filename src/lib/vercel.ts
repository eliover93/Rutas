const VERCEL_API = 'https://api.vercel.com';
const TEAM_QUERY = process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : '';

async function vercelFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${VERCEL_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return res;
}

// Añade el dominio al proyecto de Vercel. Si ya está añadido (por otra
// agencia, típicamente por error), Vercel devuelve un error claro que
// dejamos pasar tal cual.
export async function addDomainToProject(domain: string) {
  const res = await vercelFetch(`/v10/projects/${process.env.VERCEL_PROJECT_ID}/domains${TEAM_QUERY}`, {
    method: 'POST',
    body: JSON.stringify({ name: domain }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Error añadiendo el dominio en Vercel');
  return data;
}

// misconfigured: false significa que el DNS ya apunta bien y el dominio
// está sirviendo tráfico de verdad.
export async function getDomainConfig(domain: string): Promise<{ misconfigured: boolean }> {
  const res = await vercelFetch(`/v6/domains/${domain}/config${TEAM_QUERY}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Error consultando el dominio');
  return data;
}

export async function removeDomainFromProject(domain: string) {
  const res = await vercelFetch(`/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}${TEAM_QUERY}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error?.message || 'Error eliminando el dominio');
  }
}
