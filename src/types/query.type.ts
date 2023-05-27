export type QueryType<Entity> = {
    [key in keyof Entity]: Entity[key] | any;
};

export type FilterQueryType<Entity> = QueryType<Partial<Entity>>;
