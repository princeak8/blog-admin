import {apiAuthClient} from "./client";

const endpoint = "login";

export const loginUser = (email, password, domainName) =>
  apiAuthClient.post(
    endpoint,
    { email, password, domain_name: domainName },
    { headers: { "Content-Type": "application/json" } }
  );

// export default { loginUser };
