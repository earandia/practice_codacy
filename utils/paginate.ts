import { Model, Document, Query } from 'mongoose';

export interface PaginateOptions {
    columns?: string | { [key: string]: number };
    sortBy?: object;
    populate?: string | object | (string | object)[];
}

export interface PaginateResult<T> {
    pageCount: number;
    results: T[];
    total: number
}

async function paginate<T extends Document>(
    model: Model<T>,
    query: object,
    pageNumber: number = 1,
    resultsPerPage: number = 10,
    options: PaginateOptions = {}
): Promise<PaginateResult<T>> {
    const { columns, sortBy = { _id: 1 }, populate } = options;
    const skipFrom = (pageNumber - 1) * resultsPerPage;
    let findQuery: Query<T[], T> = model.find(query)
        .skip(skipFrom)
        .limit(resultsPerPage)
        .sort(sortBy as any) as any;
    if (columns) {
        findQuery = findQuery.select(typeof columns === 'string' ? columns : (columns as { [key: string]: number })) as any;
    }

    if (populate) {
        findQuery = findQuery.populate(populate as any) as any;
    }

    try {
        const [results, count] = await Promise.all([
            findQuery.exec(),
            model.countDocuments(query).exec(),
        ]);

        const pageCount = Math.max(Math.ceil(count / resultsPerPage), 1);
        return { pageCount, results, total: count };
    } catch (error) {
        throw new Error(`Pagination Error: ${error}`);
    }
}

export default paginate;
