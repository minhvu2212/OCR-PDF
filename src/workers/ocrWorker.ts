import { createWorker, createScheduler } from 'tesseract.js';
import { OcrJob, OcrMessage } from '../types/ocr.types';

// Biến global để lưu trữ scheduler
let scheduler: any = null;

// Khởi tạo scheduler và workers
async function initializeScheduler(numWorkers: number = 2) {
  scheduler = createScheduler();

  for (let i = 0; i < numWorkers; i++) {
    // Sử dụng as any để bỏ qua các lỗi TypeScript
    const worker = (createWorker as any)({
      logger: (m: any) => {
        self.postMessage({
          type: 'progress',
          workerId: i,
          progress: m.progress,
          status: m.status,
        });
      },
    });

    await (worker as any).load();
    scheduler.addWorker(worker);
  }

  self.postMessage({ type: 'initialized' });
}

// Xử lý OCR cho một trang
async function processPage(job: OcrJob) {
  try {
    const { imageUrl, lang, pageNumber } = job;

    // Thực hiện OCR
    const result = await scheduler.addJob('recognize', imageUrl, { lang });

    // Trả về kết quả
    self.postMessage({
      type: 'result',
      pageNumber,
      text: result.data.text,
    });
  } catch (error: any) {
    self.postMessage({
      type: 'error',
      pageNumber: job.pageNumber,
      error: error.message,
    });
  }
}

// Xử lý message từ main thread
self.addEventListener('message', async function (e: MessageEvent<OcrMessage>) {
  const data = e.data;

  switch (data.type) {
    case 'initialize':
      await initializeScheduler(data.numWorkers);
      break;
    case 'process':
      if (data.job) {
        await processPage(data.job);
      }
      break;
    case 'terminate':
      if (scheduler) {
        await scheduler.terminate();
      }
      self.close();
      break;
  }
});
