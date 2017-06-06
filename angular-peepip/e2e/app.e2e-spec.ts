import { AngularPeepipPage } from './app.po';

describe('angular-peepip App', () => {
  let page: AngularPeepipPage;

  beforeEach(() => {
    page = new AngularPeepipPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
