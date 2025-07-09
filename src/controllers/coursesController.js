import supabase  from '../config/db.js'; // your configured Supabase client

// Add a new course
export const addcourse = async (req, res) => {
  const {title, link, description, duration, difficulty, organization, image} = req.body;

  try {
    const { data, error } = await supabase
      .from('courses')
      .insert([
        {title, link, description, duration, difficulty, organization, image}
      ]);

    if (error) throw error;

    res.status(201).json({ message: 'course added successfully', data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add course', details: err.message });
  }
};

// Get all courses with subject info
export const getAllcourses = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *
      `).eq('visibility_status', 'visible');

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses', details: err.message });
  }
};
export const updatecourses = async (req, res) => {
  const { course_id, ...fieldsToUpdate } = req.body;

  if (!course_id) {
    return res.status(400).json({ error: 'course ID is required' });
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ error: 'No update fields provided' });
  }

  try {
    const { data, error } = await supabase
      .from('courses')
      .update(fieldsToUpdate)
      .eq('course_id', course_id);

    if (error) throw error;

    res.status(200).json({
      message: 'course(s) updated successfully',
      updated: data,
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to update course(s)',
      details: err.message,
    });
  }
};


// Delete a course
export const deletecourse = async (req, res) => {
  const { course_id } = req.body;

  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('course_id', course_id);

    if (error) throw error;

    res.status(200).json({ message: 'course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course', details: err.message });
  }
};
