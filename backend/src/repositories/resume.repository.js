const { prisma } = require("../config/db");

const INSERT_RESUME = `
  INSERT INTO resumes (user_id, title, status, original_filename, storage_path)
  VALUES ($1::uuid, $2, 'uploaded', $3, $4)
  RETURNING *
`;

async function createResume({ userId, title, originalFilename, storagePath }) {
  const [resume] = await prisma.$queryRawUnsafe(
    INSERT_RESUME,
    userId,
    title,
    originalFilename,
    storagePath,
  );
  return resume;
}

module.exports = { createResume };
