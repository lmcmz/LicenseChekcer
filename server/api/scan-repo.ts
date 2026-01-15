import 'dotenv/config';
import { defineEventHandler, readBody } from 'h3';
import { scanRepository } from '../utils/scanRepository';

interface RepoScanRequest {
  repoUrl: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RepoScanRequest>(event);

  if (!body || !body.repoUrl) {
    return { success: false, error: 'Repository URL is required' };
  }

  return await scanRepository(body.repoUrl);
});
