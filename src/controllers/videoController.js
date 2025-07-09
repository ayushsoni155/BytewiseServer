import supabase  from '../config/db.js'; // your configured Supabase client

// Add a new video
export const addvideo = async (req, res) => {
  const { subject_code, video_url, video_description, visibility } = req.body;

  try {
    const { data, error } = await supabase
      .from('videos')
      .insert([
        {
          subject_code,
          video_url,
          video_description,
          visibility,
        }
      ]);

    if (error) throw error;

    res.status(201).json({ message: 'video added successfully', data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add video', details: err.message });
  }
};

// Get all videos with subject info
export const getAllvideos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        subjects (
          name,
          sem,
          branch
        )
      `)
      .eq('visibility_status', 'visible')
      .order('sem', { foreignTable: 'subjects', ascending: true })
      .order('subject_code', { ascending: true });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch videos', details: err.message });
  }
};
export const updatevideo = async (req, res) => {
  const { video_id, ...fieldsToUpdate } = req.body;

  if (!video_id) {
    return res.status(400).json({ error: 'video ID is required' });
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ error: 'No update fields provided' });
  }

  try {
    const { data, error } = await supabase
      .from('videos')
      .update(fieldsToUpdate)
      .eq('video_id', video_id);

    if (error) throw error;

    res.status(200).json({
      message: 'video(s) updated successfully',
      updated: data,
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to update video(s)',
      details: err.message,
    });
  }
};


// Delete a video
export const deletevideo = async (req, res) => {
  const { video_id } = req.body;

  try {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('video_id', video_id);

    if (error) throw error;

    res.status(200).json({ message: 'video deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete video', details: err.message });
  }
};
