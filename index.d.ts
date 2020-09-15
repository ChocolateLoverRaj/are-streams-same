import { Readable } from 'stream';

interface Result {
    same: boolean;
    reason: string;
}

declare function areStreamsSame(stream1: Readable, stream2: Readable): Promise<Result>;

export default areStreamsSame;