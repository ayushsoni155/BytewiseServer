import supabase  from '../config/db.js'; // your configured Supabase client

// Add a new note
export const addNote = async (req, res) => {
  const { subject_code, pdf_url, image, visibility } = req.body;

  try {
    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          subject_code,
          pdf_url,
          image,
          visibility,
        }
      ]);

    if (error) throw error;

    res.status(201).json({ message: 'Note added successfully', data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add note', details: err.message });
  }
};

// Get all notes with subject info
export const getAllNotes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        subjects (
          name,
          sem,
          branch,
          description
        )
      `)
      .eq('visibility_status', 'visible')
      .order('sem', { foreignTable: 'subjects', ascending: true })
      .order('subject_code', { ascending: true });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes', details: err.message });
  }
};

export const updateNotes = async (req, res) => {
  const { notes_id, ...fieldsToUpdate } = req.body;

  if (!notes_id) {
    return res.status(400).json({ error: 'Notes ID is required' });
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ error: 'No update fields provided' });
  }

  try {
    const { data, error } = await supabase
      .from('notes')
      .update(fieldsToUpdate)
      .eq('notes_id', notes_id);

    if (error) throw error;

    res.status(200).json({
      message: 'Note(s) updated successfully',
      updated: data,
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to update note(s)',
      details: err.message,
    });
  }
};


// Delete a note
export const deleteNote = async (req, res) => {
  const { notes_id } = req.body;

  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('notes_id', notes_id);

    if (error) throw error;

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note', details: err.message });
  }
};
