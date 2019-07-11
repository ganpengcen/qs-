import Api from "@/kites/api";
import { Post } from "@/api/api";

export async function getDicDatasByType(type) {
    try {
      const res = await Post(Api.GetDicDatasByType, { type: type });
      if (res.success) {
        return  res.result.items
      }
    } catch (e) {
      console.log(e);
    }
  }