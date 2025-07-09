import supabase  from '../config/db.js'; // your configured Supabase client

// Add a new subject
export const addsubject = async (req, res) => {
  const { subject_code, name, sem, branch, description } = req.body;

  try {
    const { data, error } = await supabase
      .from('subjects')
      .insert([
        {
          subject_code,
         name,
         sem,
         branch,
         description
        }
      ]);

    if (error) throw error;

    res.status(201).json({ message: 'subject added successfully', data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add subject', details: err.message });
  }
};

// Get all subjects with subject info
export const getAllsubjects = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *
      `);

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subjects', details: err.message });
  }
};
export const updatesubjects = async (req, res) => {
  const { subject_code, ...fieldsToUpdate } = req.body;

  if (!subject_code) {
    return res.status(400).json({ error: 'subject code is required' });
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ error: 'No update fields provided' });
  }

  try {
    const { data, error } = await supabase
      .from('subjects')
      .update(fieldsToUpdate)
      .eq('subject_code', subject_code);

    if (error) throw error;

    res.status(200).json({
      message: 'subject(s) updated successfully',
      updated: data,
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to update subject(s)',
      details: err.message,
    });
  }
};


// Delete a subject
export const deletesubject = async (req, res) => {
  const { subject_code } = req.body;

  try {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('subject_code', subject_code);

    if (error) throw error;

    res.status(200).json({ message: 'subject deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete subject', details: err.message });
  }
};
