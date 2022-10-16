import { supabase } from "../supabaseClient";

const getProfile = async (
  session,
  setLoading,
  setName,
  setImageUrl,
  setUserOrgId
) => {
  try {
    setLoading(true);
    const { user } = session;

    let { data, error, status } = await supabase
      .from("User")
      .select(`name, email, imageUrl, OrgId`)
      .eq("id", user.id)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      setName(data.name);
      setImageUrl(data.imageUrl);
      setUserOrgId(data.OrgId);
    }
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

export default getProfile;
