import { create } from "apisauce";

// export const apiAuthClient = create({
//   baseURL: "https://blog-api-auth.zizix6host.com/api/v1/",
//   timeout: 15000,
// });

// export const apiPostClient = create({
//   baseURL: "https://blog-api.zizix6host.com/api/v1/",
//   timeout: 15000,
// });

export const apiAuthClient = create({
  baseURL: "http://localhost/blog-api-auth/public/api/v1/",
  timeout: 15000,
});

export const apiPostClient = create({
  baseURL: "http://localhost/blog-api/public/api/v1/",
  timeout: 15000,
});

// export default { apiAuthClient, apiPostClient };
