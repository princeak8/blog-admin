import {apiPostClient} from "./client";

const user_url = "/admin/profile/";
const user_info_url = "/admin/profile/create";

export const getUser = (id, domain, accessToken) =>
  apiPostClient.get(
    domain + user_url + id,
    {},
    {
      headers: { Authorization: `bearer ${accessToken}` },
    }
  );

export const updateUserInfo = (user, domain, accessToken) =>
  apiPostClient.post(domain + user_info_url, user, {
    headers: { Authorization: `bearer ${accessToken}` },
  });

// export default { getUser, updateUserInfo };
