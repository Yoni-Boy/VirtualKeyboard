export interface KeyActions {
    validate: ((args: string) => boolean) | undefined;
    //When We click on 'accept' keyboard button then We execute this method 
    accept: ((args: string) => boolean | void) | undefined;
    //When We click on 'accept' keyboard button then We execute this method 
    accept_with_id: ((args: string) => any | void) | undefined;
  }
  