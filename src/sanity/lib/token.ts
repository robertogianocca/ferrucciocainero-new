export const token = process.env.SANITY_API_READ_TOKEN;

export function assertToken() {
  if (!token) {
    throw new Error("Missing SANITY_API_READ_TOKEN");
  }
  return token;
}
