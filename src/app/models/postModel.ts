export class PostModel {
    constructor(
        public id:          number,
        public img_url:     string,
        public description: string,
        public user_id:     number,
        public user_name:   string,
    ) { }
}
