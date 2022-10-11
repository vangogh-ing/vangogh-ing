import { supabase } from "../supabaseClient";

const getProfile = async (session, setLoading, setName, setImageUrl) => {
  try {
    setLoading(true);
    const { user } = session;

    let { data, error, status } = await supabase
      .from("User")
      .select(`name, email, imageUrl`)
      .eq("id", user.id)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      setName(data.name);
      setImageUrl(data.imageUrl);
    }
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

export default getProfile;
