export interface CreatePostInput {
  content?: string;
  privacy: "PUBLIC" | "PRIVATE";
  group?: string;
  feelings?: {
    emoji: string;
    type: string;
    text: string;
  };
  entities: {
    end: number;
    offset: number;
    target: string;
    type: string;
    text: string;
  }[];
}
