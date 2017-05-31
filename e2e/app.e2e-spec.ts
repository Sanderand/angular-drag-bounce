import { AngularDragBouncePage } from './app.po';

describe('angular-drag-bounce App', () => {
  let page: AngularDragBouncePage;

  beforeEach(() => {
    page = new AngularDragBouncePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
