# Error Log Template - Hướng dẫn sử dụng

## Cấu trúc Google Sheets

### Sheet Name: "Error Log Template"

### Table Name: "ErrorLogTbl" (không bắt buộc)

### Columns (Headers):

| Column Name                 | Required | Description            | Example                                        |
| --------------------------- | -------- | ---------------------- | ---------------------------------------------- |
| No.                         | Yes      | Số thứ tự              | 1, 2, 3...                                     |
| Date                        | Yes      | Ngày gặp lỗi           | 11/09/2025 hoặc 09/11/2025                     |
| Type                        | No       | Loại nguồn             | Sách, JLPT, App, Test                          |
| Source                      | Yes      | Nguồn cụ thể           | Shinkanzen N2, jlpt247.com                     |
| Part                        | Yes      | Phần kiến thức         | Grammar, Vocabulary, Kanji, Reading, Listening |
| Passage or Question (short) | Yes      | Câu hỏi hoặc đoạn văn  | 飛行機は今()                                   |
| Your Answer                 | No       | Câu trả lời sai        | b) 飛び立ちつつあります                        |
| Correct Answer              | Yes      | Đáp án đúng            | a) 飛び立とようとしています                    |
| Explain Error Reason        | No       | Giải thích lỗi         | Trong câu mẫu, người phiền là...               |
| Action                      | No       | Hành động khắc phục    | Strategy Mini-rule                             |
| SRS?                        | No       | Có cần flashcard không | Yes, No, 1, 0                                  |
| Planned Review Date         | No       | Ngày ôn tập            | 25/09/2025                                     |
| Status                      | No       | Trạng thái             | New, In Progress, Done, Archived               |
| Notes                       | No       | Ghi chú thêm           | -                                              |

## Ví dụ dữ liệu:

### Row 1 - Grammar Error:

No: 4
Date: 11/09/2025
Type: Sách
Source: Shinkanzen Ngữ Pháp N2 Bài 2 Bài tập 6
Part: Grammar
Passage: 飛行機は今()
Your Answer: b) 飛び立ちつつあります
Correct Answer: a) 飛び立とようとしています
Explain: つつある diễn tả hành động đang diễn ra dần dần, trong khi ようとしている diễn tả ý định sắp làm gì
Action: Review ～ようとする vs ～つつある
SRS?: Yes
Planned Review Date: 15/09/2025
Status: New
Notes:

### Row 2 - Reading Error:

No: 5
Date: 25/09/2025
Type: Sách
Source: Shinkanzen Đọc hiểu N2 trang 127
Part: Reading
Passage: 問 2:②「毎日本当に食べて寝て遊んでばかりいられても困ると言えば困る」とはどういうことか。
Your Answer: 1．母親が全然子供を𠮟らず放っておくと、子どもが困る。
Correct Answer: 3．子供が遊んでばかりでは、大人になった時のことが心配で親が困る。
Explain: Trong câu mẫu, người phiền là người mẹ/người viết, không phải đứa trẻ
Action: Strategy Mini-rule
SRS?: No
Status: Done
Notes:

### Row 3 - Vocabulary Error:

No: 8
Date: 28/09/2025
Type: JLPT
Source: https://jlpt247.com/n2-jlpt-7-2025-2/
Part: Vocabulary
Passage: 私の友人は（刑事）です。
Your Answer:
Correct Answer: 刑事 (けいじ - thám tử)
Explain: Don't know this word
Action: Add to SRS
SRS?: Yes
Planned Review Date: 30/09/2025
Status: New
Notes: Vocabulary from JLPT practice test

## Lưu ý khi sử dụng:

1. **Date Format**: Hỗ trợ DD/MM/YYYY hoặc MM/DD/YYYY
2. **Part**: Phải đúng một trong: Grammar, Vocabulary, Kanji, Reading, Listening
3. **SRS?**: Yes/No hoặc 1/0 hoặc true/false
4. **Status**: New (mặc định), In Progress, Reviewing, Done, Archived
5. **Share Settings**: Sheet phải public "Anyone with the link can view"

## Tính năng tự động:

- Errors có SRS? = Yes sẽ tự động tạo flashcard
- Status = Done hoặc Archived sẽ không được import
- Tự động phát hiện JLPT level từ Source
- Tự động link với Grammar/Vocabulary/Kanji đã có
