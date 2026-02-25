import { test, expect } from '@playwright/test';

test('controls-row は iPhone 11 Pro 幅(375px)で1段に収まる', async ({ page }) => {
  // iPhone 11 Pro CSS幅: 375px
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  // controls-row が存在するまで待機
  const row = page.locator('.controls-row');
  await row.waitFor({ state: 'visible', timeout: 10000 });

  const box = await row.boundingBox();
  if (!box) throw new Error('.controls-row のboundingBoxが取得できませんでした');

  const height = box.height;
  console.log(`[controls-row] height=${height}px, width=${box.width}px`);

  // 1段の場合: inputの高さ+padding ≒ 36px 程度、余裕を持って 60px 未満
  const ONE_LINE_MAX = 60;
  console.log(`1段判定: height(${height}) < ${ONE_LINE_MAX} → ${height < ONE_LINE_MAX ? 'OK (1段)' : 'NG (複数段)'}`);
  expect(height, `controls-row が1段に収まっていない (height=${height}px)`).toBeLessThan(ONE_LINE_MAX);
});

test('App.tsx の表示順: chart-container → 降水確率 → controls', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  // main 直下の子要素の順序を確認
  const main = page.locator('.app-main');
  const children = main.locator('> *');
  const count = await children.count();
  console.log(`app-main 直下の子要素数: ${count}`);

  const classNames: string[] = [];
  for (let i = 0; i < count; i++) {
    const cls = await children.nth(i).getAttribute('class');
    classNames.push(cls ?? '');
    console.log(`  [${i}] class="${cls}"`);
  }

  // chart-container が最初
  expect(classNames[0]).toContain('chart-container');
  // controls が最後
  expect(classNames[classNames.length - 1]).toContain('controls');
});
