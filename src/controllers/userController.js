import bcrypt from 'bcryptjs';
import supabase from '../config/db.js'; // Ensure correct path

// Change Password Controller
export async function changePassword(req, res) {
  const { security_answer, new_password, enrollment} = req.body;

  if (!enrollment ||!security_answer || !new_password) {
    return res.status(400).json({ message: 'Enrollment,Security answer and new password are required.' });
  }

  try {
    // Fetch hashed security answer from DB
    const { data: user, error } = await supabase
      .from('users')
      .select('security_answer')
      .eq('enrollment', enrollment)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare security answer
    const isAnswerMatch = await bcrypt.compare(security_answer, user.security_answer);
    if (!isAnswerMatch) {
      return res.status(401).json({ message: 'Security answer is incorrect.' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    // Update password
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedNewPassword })
      .eq('enrollment', enrollment);

    if (updateError) {
      return res.status(500).json({ message: updateError.message });
    }

    res.json({ message: 'Password changed successfully.' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Update User Info
export const updateuser = async (req, res) => {
  const fieldsToUpdate = req.body;
  const enrollment = req.user?.enrollment;

  if (!enrollment) {
    return res.status(401).json({ error: 'Unauthorized. Enrollment is missing from token.' });
  }

  if (!fieldsToUpdate || Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ error: 'No fields provided for update.' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update(fieldsToUpdate)
      .eq('enrollment', enrollment)
      .select(); // return updated user if needed

    if (error) throw error;

    res.status(200).json({
      message: 'User updated successfully.',
      updated: data,
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to update user.',
      details: err.message,
    });
  }
};
export const verifyEnrollment = async (req, res) => {
  const { enrollment } = req.body;

  if (!enrollment) {
    return res.status(400).json({ message: 'Enrollment is required.' });
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('security_question')
      .eq('enrollment', enrollment)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ security_question: user.security_question });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete User Account
export const deleteuser = async (req, res) => {
  const enrollment = req.user?.enrollment;

  if (!enrollment) {
    return res.status(401).json({ error: 'Unauthorized. Enrollment not found in token.' });
  }

  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('enrollment', enrollment);

    if (error) throw error;

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user.', details: err.message });
  }
};
