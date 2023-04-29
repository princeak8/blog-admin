import {apiPostClient} from "./client";

const GET_TAG = "/admin/tag/all";
const SAVE_TAG = "/admin/tag/save";
const IMAGE_UPLOAD_URL = "/admin/file/save_cover_photo";
const SAVE_POST_URL = "/admin/post/save";
const UPDATE_POST_URL = "/admin/post/update";
const ALL_POST = "/admin/post/all";
const PUBLISH = "/admin/post/toggle_publish/";
const DELETE_URL = "/admin/post/delete/";

export const getTags = (domain, accessToken) =>
  apiPostClient.get(
    domain + GET_TAG,
    {},
    {
      headers: { Authorization: `bearer ${accessToken}` },
    }
  );

export const getAllPosts = (domain, accessToken) =>
  apiPostClient.get(
    domain + ALL_POST,
    {},
    {
      headers: { Authorization: `bearer ${accessToken}` },
    }
  );

export const togglePublish = (id, domain, accessToken) =>
  apiPostClient.get(
    domain + PUBLISH + id,
    {},
    {
      headers: { Authorization: `bearer ${accessToken}` },
    }
  );

export const saveTag = (domain, accessToken, tag) =>
  apiPostClient.post(
    domain + SAVE_TAG,
    { name: tag },
    {
      headers: { Authorization: `bearer ${accessToken}` },
    }
  );

export const uploadImage = (domain, accessToken, image) =>
  apiPostClient.post(domain + IMAGE_UPLOAD_URL, image, {
    headers: { Authorization: `bearer ${accessToken}` },
  });

export const savePost = (domain, accessToken, post) =>
  apiPostClient.post(domain + SAVE_POST_URL, post, {
    headers: { Authorization: `bearer ${accessToken}` },
  });

export const updatePost = (domain, accessToken, post) =>
  apiPostClient.post(domain + UPDATE_POST_URL, post, {
    headers: { Authorization: `bearer ${accessToken}` },
  });

export const deletePost = (id, domain, accessToken) =>
  apiPostClient.delete(
    domain + DELETE_URL + id,
    {},
    {
      headers: { Authorization: `bearer ${accessToken}` },
    }
  );

