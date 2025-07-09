import supabase  from '../config/db.js';

export const submitFeedback = async (req, res) => {
  const enrollment = req.user?.enrollment;
  const { message, category } = req.body;

  if (!message || !category) {
    return res.status(400).json({ message: 'Message and category are required.' });
  }

  try {
    const { error } = await supabase
      .from('feedback')
      .insert([{
        enrollment,
        message,
        category: category
      }]);

    if (error) throw error;

    res.status(201).json({ message: 'Feedback submitted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit feedback.', error: err.message });
  }
};

export const getMyFeedback = async (req, res) => {
  const enrollment = req.user?.enrollment;

  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('enrollment', enrollment)
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ feedback: data });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch feedback.', error: err.message });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*, users(name)')
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ feedbacks: data });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all feedback.', error: err.message });
  }
};
