export class UtilHelper {
    static slugify(str: string) {
        return str
            ? str
                  .toLowerCase()
                  .trim()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/[\s_-]+/g, '-')
                  .replace(/^-+|-+$/g, '')
            : '';
    }
}
