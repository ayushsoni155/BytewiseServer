import supabase from '../config/db.js';

// Add to cart (check if already present, then update quantity)
export const addToCart = async (req, res) => {
  const { lab_manual_id, quantity } = req.body;
  const enrollment = req.user.enrollment;

  if (!enrollment || !lab_manual_id || !quantity) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // 1. Check if item already in cart
    const { data: existingItems, error: fetchError } = await supabase
      .from('cart')
      .select('*')
      .eq('enrollment', enrollment)
      .eq('lab_manual_id', lab_manual_id)
      .limit(1);

    if (fetchError) throw fetchError; 

    if (existingItems.length > 0) {
      // If exists, update quantity
      const existingItem = existingItems[0];

      const { data, error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('cart_id', existingItem.cart_id);

      if (error) throw error;

      return res.status(200).json({ message: 'Cart updated successfully', data });
    } else {
      // Else, insert new item
      const { data, error } = await supabase
        .from('cart')
        .insert([{ enrollment, lab_manual_id, quantity }]);

      if (error) throw error;

      return res.status(201).json({ message: 'Item added to cart successfully', data });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add item to cart', details: err.message });
  }
};

// Get all cart items for a user
export const getCartItems = async (req, res) => {
  const enrollment = req.user.enrollment;

  if (!enrollment) {
    return res.status(400).json({ error: 'Enrollment is required' });
  }

  try {
    // Step 1: Get cart with joined lab_manuals
    const { data, error } = await supabase
      .from('cart')
      .select(`
        *,
        lab_manuals (
          manual_image,
          no_of_pages,
          manual_description,
          selling_price,
          visibility_status,
          subjects (
            name,
            sem,
            branch
          )
        )
      `)
      .eq('enrollment', enrollment);

    if (error) throw error;

    // Step 2: Filter only visible lab_manuals
    const filtered = data.filter(item => item.lab_manuals?.visibility_status === 'visible');

    // Step 3: Add calculated total_price
    const cartWithPrice = filtered.map(item => ({
      ...item,
      total_price: item.lab_manuals?.selling_price * item.quantity || 0
    }));

    res.status(200).json(cartWithPrice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart items', details: err.message });
  }
};


// Delete cart item by cart_id
export const deleteCartItem = async (req, res) => {
  const { cart_id } = req.body;

  if (!cart_id) {
    return res.status(400).json({ error: 'cart_id is required' });
  }

  try {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('cart_id', cart_id);

    if (error) throw error;

    res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete cart item', details: err.message });
  }
};

// Clear entire cart for logged-in user
export const clearCart = async (req, res) => {
  const enrollment = req.user.enrollment;

  if (!enrollment) {
    return res.status(400).json({ error: 'Enrollment is required' });
  }

  try {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('enrollment', enrollment);

    if (error) throw error;

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart', details: err.message });
  }
};
