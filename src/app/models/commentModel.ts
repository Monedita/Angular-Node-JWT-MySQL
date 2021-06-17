export class CommentModel{
    constructor(
        public id:          number,
        public comment:     string,
        public post_id:     number,
        public user_id:     number,
        public user_name:   string,
    ) { }
}
