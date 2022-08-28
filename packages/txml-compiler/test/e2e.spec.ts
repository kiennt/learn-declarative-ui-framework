import { compile } from "../lib";
import prettier from "prettier";
import { describe, it } from "vitest";

describe("e2e", () => {
  it("miki", async () => {
    // const resp = await axios.get(url);
    // const data = resp.data;
    const data = `
<global class="index-page pb-16 fixed__wrap fixed__fix-search">
<view class="fixed__search">
  <search-bar />
</view>

<view class="mt-16 reading">
  Bạn muốn đọc cuốn sách nào mà Miki hiện không có?
  <view class="mt-16" style="justify-content: flex-end; display: flex">
    <button shape="rounded" size="medium" onTap="openChat">Gửi góp ý</button>
  </view>

</view>

<view class="mt-16 reading">
  <view>
    <app-image lazyLoad="{{false}}" className="size-16 mr-8" src="/assets/images/account-book.svg" />
    <text class="font-16">Sách từ thư viện</text>
  </view>
  <view class="flex o-hidden" tiki:if="{{readingBookLoading}}">
    <view class="item" tiki:for="{{[1, 2, 3, 4]}}">
      <skeleton />
    </view>
  </view>

  <scroll-view
    tiki:else
    scroll-x
    class="flex"
    onScrollToLower="onLoadMore"
  >
    <view tiki:if="{{!reading.length}}" style="margin-top: 10px;">
      Bạn chưa đọc cuốn sách nào
    </view>

    <view
      class="item"
      tiki:else
      tiki:for="{{reading}}"
      tiki:key="id"
    >
      <book-card continueReading book="{{item.book}}" />
    </view>
  </scroll-view>
</view>

<view class="mt-16 reading" tiki:if="{{recommendations.length}}">
  <heading text="Đề xuất cho bạn" subtitle="Dựa trên nội dung bạn đã đọc: {{recommendations[0].basedFrom}}" />

  <scroll-view
    scroll-x
    class="flex"
    onScrollToLower="onLoadMore"
  >

    <view
      class="item"
      tiki:for="{{recommendations[0].books}}"
      tiki:key="id"
    >
      <book-card book="{{item.book}}" />
    </view>
  </scroll-view>
</view>

<categories onViewMoreCategory="onViewMoreCategory" items="{{categories}}" />

<view class="mt-16 reading" tiki:if="{{recommendations.length > 1}}" tiki:for="{{recommendations.slice(1)}}">
  <heading text="Dựa trên sách bạn đã đọc" subtitle="Dựa trên nội dung bạn đã đọc: {{item.basedFrom}}" />

  <scroll-view
    scroll-x
    class="flex"
    onScrollToLower="onLoadMore"
  >

    <view
      class="item"
      tiki:for="{{item.books}}"
      tiki:key="id"
    >
      <book-card book="{{item.book}}" />
    </view>
  </scroll-view>
</view>

<view class="reading-book-break" tiki:if="{{readingBook}}" />

<continue-reading tiki:if="{{readingBook}}" book="{{readingBook}}" />
</global>`;
    const code = compile(data);
    console.log(prettier.format(code));
  });
});
