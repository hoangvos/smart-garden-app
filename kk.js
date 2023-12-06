const mongoose = require('mongoose');
const sensors = require('./models/sensors'); // Thay thế bằng đường dẫn thực tế đến file model của bạn

mongoose.connect('mongodb+srv://hoang:hoang0965766364@cluster0.ambcnxe.mongodb.net/session-store?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

(async () => {
  try {
    // Tìm tất cả các bản ghi trong bộ sưu tập
    const documents = await sensors.find({});

    // Lặp qua từng bản ghi và thêm trường createdAt nếu chưa có
    for (const doc of documents) {
      if (!doc.createdAt) {
        doc.createdAt = new Date();
        doc.updatedAt = new Date();
        await doc.save();
      }
    }

    console.log('Cập nhật thành công!');
  } catch (error) {
    console.error('Lỗi khi cập nhật:', error);
  } finally {
    mongoose.disconnect();
  }
})();