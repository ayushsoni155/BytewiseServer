import supabase from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export const placeOrder = async (req, res) => {
  const enrollment = req.user?.enrollment;
  const { transaction_id, items } = req.body;

  if (!enrollment) {
    return res.status(401).json({ message: 'Unauthorized. Enrollment not found.' });
  }

  if (!transaction_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Transaction ID and items are required.' });
  }

  try {
    const order_id = uuidv4();
    let total_price = 0;
    const orderItemsData = [];

    for (const item of items) {
      const { lab_manual_id, quantity } = item;

      if (!lab_manual_id || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Each item must have a valid lab_manual_id and quantity > 0.' });
      }

      // Fetch price from lab_manuals table
      const { data: manual, error: manualError } = await supabase
        .from('lab_manuals')
        .select('selling_price')
        .eq('lab_manual_id', lab_manual_id)
        .eq('visibility', 'visible') // Optional: only allow visible manuals
        .single();

      if (manualError || !manual) {
        return res.status(404).json({ message: `Lab manual not found or not visible: ${lab_manual_id}` });
      }

      const item_price = manual.selling_price;
      total_price += item_price * quantity;

      orderItemsData.push({
        order_id,
        lab_manual_id,
        quantity,
        item_price,
      });
    }

    // Insert order into 'orders' table
    const { error: orderError } = await supabase
      .from('orders')
      .insert([{ order_id, enrollment, transaction_id, total_price }]);

    if (orderError) throw orderError;

    // Insert all order items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) throw itemsError;

    res.status(201).json({ message: 'Order placed successfully.', order_id });
  } catch (err) {
    console.error('Place order error:', err);
    res.status(500).json({ message: 'Failed to place order.', error: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  const enrollment = req.user?.enrollment;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('enrollment', enrollment)
      .order('order_date', { ascending: false });

    if (error) throw error;

    res.status(200).json({ orders: data });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders.', error: err.message });
  }
};
export const cancelOrder = async (req, res) => {
  const { order_id } = req.body;
  const enrollment = req.user?.enrollment;

  try {
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('status')
      .eq('order_id', order_id)
      .eq('enrollment', enrollment)
      .single();

    if (fetchError || !order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled.' });
    }

    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('order_id', order_id)
      .eq('enrollment', enrollment);

    if (error) throw error;

    res.status(200).json({ message: 'Order cancelled successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel order.', error: err.message });
  }
};
