const VERCEL_API = 'https://api.vercel.com';

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

// Añade el dominio al proyecto de Vercel. Si ya está añadido a ESTE MISMO
// proyecto (por ejemplo, por un intento anterior), lo tratamos como éxito
// en vez de como error — el resultado que queremos ya está conseguido.
export async function addDomainToProject(domain: string) {
  const res = await vercelFetch(`/v10/projects/${process.env.VERCEL_PROJECT_ID}/domains`, {
    method: 'POST',
    body: JSON.stringify({ name: domain }),
  });
  const data = await res.json();

  if (!res.ok) {
    const alreadyOnThisProject =
      typeof data.error?.message === 'string' && data.error.message.includes('already in use by one of your projects');
    if (!alreadyOnThisProject) {
      throw new Error(data.error?.message || 'Error añadiendo el dominio en Vercel');
    }
  }

  return data;
}

// misconfigured: false significa que el DNS ya apunta bien y el dominio
// está sirviendo tráfico de verdad.
export async function getDomainConfig(domain: string): Promise<{ misconfigured: boolean }> {
  const res = await vercelFetch(`/v6/domains/${domain}/config`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Error consultando el dominio');
  return data;
}

export async function removeDomainFromProject(domain: string) {
  const res = await vercelFetch(`/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error?.message || 'Error eliminando el dominio');
  }
}
