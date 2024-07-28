const { Order, OrderItem, MenuItem, User, Branch,Offer } = require('../models');



exports.createOrder = async (req, res) => {
  try {
    const { id } = req.user;
    const { BranchId, items, offerId } = req.body;
    let discountedTotalPrice = 0;

    // Calculate the total quantity of items in the order
    let totalQuantity = 0;
    for (const item of items) {
      totalQuantity += item.quantity;
    }

    // Calculate the total price without discount
    let totalPriceWithoutDiscount = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.MenuItemId);
      if (menuItem) {
        totalPriceWithoutDiscount += menuItem.price * item.quantity;
      }
    }

    // Check if offer ID is provided and valid
    if (offerId) {
      const offer = await Offer.findByPk(offerId);
      if (!offer) {
        return res.status(400).json({ error: 'Invalid offer ID' });
      }

      // Check if the offer is valid
      const currentDate = new Date();
      if (currentDate < offer.valid_from || currentDate > offer.valid_to) {
        return res.status(400).json({ error: 'Offer is not valid' });
      }

      // Check minimum order amount
      if (totalPriceWithoutDiscount < offer.min_order_amount) {
        return res.status(400).json({ error: 'Order does not meet the minimum amount required for the offer' });
      }

      // Calculate the discount amount
      const discountAmount = (offer.discount_percentage / 100) * totalPriceWithoutDiscount;

      // Calculate the discounted total price
      discountedTotalPrice = totalPriceWithoutDiscount - discountAmount;

      // Calculate the discount per unit
      const discountPerUnit = discountAmount / totalQuantity;

      // Apply the discount to each item
      for (const item of items) {
        const menuItem = await MenuItem.findByPk(item.MenuItemId);
        if (menuItem) {
          // Calculate the discounted price per unit for this item
          const discountedPricePerUnit = menuItem.price - discountPerUnit;

          // Update the price of the item with the discounted price per unit
          item.price = discountedPricePerUnit;
        }
      }
    } else {
      // If no offer is applied, use the total price without discount
      discountedTotalPrice = totalPriceWithoutDiscount;

      // Keep the original price of each item if no offer is provided
      for (const item of items) {
        const menuItem = await MenuItem.findByPk(item.MenuItemId);
        if (menuItem) {
          item.price = menuItem.price;
        }
      }
    }

    // Create order
    const order = await Order.create({ UserId: id, BranchId, total_price: discountedTotalPrice, status: 'pending' });

    // Create order items
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.MenuItemId);
      if (menuItem) {
        await OrderItem.create({
          OrderId: order.id,
          MenuItemId: menuItem.id,
          quantity: item.quantity,
          price: item.price * item.quantity
        });
      }
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: [User, Branch, { model: OrderItem, include: MenuItem }] });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: [User, Branch, { model: OrderItem, include: MenuItem }] });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Allow status update only if current status is 'pending'
    if (order.status === 'completed') {
      return res.status(400).json({ error: 'This Order is Already delivered' });
    }
    if (order.status === 'cancelled') {
      return res.status(400).json({ error: 'This Order is Already Cancelled' });
    }

    // Update order status to 'completed'
    order.status = 'completed';
    await order.save();

    res.json({ message: 'Order status updated to completed successfully', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the order is cancellable (e.g., not already delivered or completed)
    if (order.status === 'delivered' || order.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel order that has already been delivered or completed' });
    }
    if (order.status === 'cancelled') {
      return res.status(400).json({ error: 'Order already cancelled' });
    }

    // Update order status to cancelled
    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    await order.destroy();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
