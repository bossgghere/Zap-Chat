import { Request, Response } from 'express';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

// Send a new message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).userId;
    const { receiverId, content, messageType = 'text' } = req.body;

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found',
      });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        unreadCount: {
          [senderId]: 0,
          [receiverId]: 0,
        },
      });
    }

    // Create message
    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      content,
      messageType,
      status: 'sent',
    });

    // Update conversation
    conversation.lastMessage = message._id;
    const currentUnread = conversation.unreadCount.get(receiverId.toString()) || 0;
    conversation.unreadCount.set(receiverId.toString(), currentUnread + 1);
    await conversation.save();

    // Populate sender info
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'username avatar')
      .populate('receiverId', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: populatedMessage,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message,
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
    const senderId = (req as any).userId;



    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to get messages',
        error: error.message,
      });
    }
  };
  