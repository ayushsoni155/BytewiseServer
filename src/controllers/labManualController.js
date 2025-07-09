import supabase from '../config/db.js'; // your configured Supabase client

// Add a new Lab Manual
export const addLabManual = async (req, res) => {
  const {
    subject_code,
    manual_description,
    manual_image,
    no_of_pages,
    cost_price,
    selling_price,
    visibility
  } = req.body;

  if (!subject_code || !manual_description || !manual_image || !no_of_pages || !cost_price || !selling_price) {
    return res.status(400).json({ error: 'All fields are required except visibility' });
  }

  const lab_manual_id = `LM${subject_code}`; // Manual ID format

  try {
    const { data, error } = await supabase
      .from('lab_manuals')
      .insert([
        {
          lab_manual_id,
          subject_code,
          manual_description,
          manual_image,
          no_of_pages,
          cost_price,
          selling_price,
          visibility: visibility || 'visible',
        },
      ]);

    if (error) throw error;

    res.status(201).json({ message: 'Lab manual added successfully', data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add lab manual', details: err.message });
  }
};

// Get all Lab Manuals with subject info
export const getAllLabManuals = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lab_manuals')
      .select(`
        lab_manual_id,
        subject_code,
        manual_description,
        manual_image,
        no_of_pages,
        selling_price,
        visibility_status,
        subjects (
          name,
          sem,
          branch
        )
      `).eq('visibility_status', 'visible')
      .order('sem', { foreignTable: 'subjects', ascending: true })
      .order('subject_code', { ascending: true });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lab manuals', details: err.message });
  }
};

// Update Lab Manual by subject_code
export const updateLabManual = async (req, res) => {
  const { lab_manual_id, ...fieldsToUpdate } = req.body;

  if (!lab_manual_id) {
    return res.status(400).json({ error: 'Lab Manual ID is required' });
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ error: 'No update fields provided' });
  }

  try {
    const { data, error } = await supabase
      .from('lab_manuals')
      .update(fieldsToUpdate)
      .eq('lab_manual_id', lab_manual_id);

    if (error) throw error;

    res.status(200).json({ message: 'Lab manual updated successfully', updated: data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update lab manual', details: err.message });
  }
};

// Delete Lab Manual by subject_code
export const deleteLabManual = async (req, res) => {
  const { lab_manual_id } = req.body;

  if (!lab_manual_id) {
    return res.status(400).json({ error: 'Lab Manual ID is required' });
  }


  try {
    const { error } = await supabase
      .from('lab_manuals')
      .delete()
      .eq('lab_manual_id', lab_manual_id);

    if (error) throw error;

    res.status(200).json({ message: 'Lab manual deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete lab manual', details: err.message });
  }
};
