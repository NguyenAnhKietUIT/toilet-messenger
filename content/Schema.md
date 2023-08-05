#### User

- `id (Primary key)`: Được thiết lập tự động (`auto-increment`) và sử dụng kiểu dữ liệu `String` để xác định duy nhất mỗi người dùng.

- `name`: Tên của người dùng.

- `email`: Địa chỉ email của người dùng, duy nhất (`unique`) trong toàn bộ hệ thống.

- `emailVerified`: Thời điểm xác minh email được thực hiện.

- `image`: Đường dẫn đến hình ảnh đại diện của người dùng.

- `hashedPassword`: Mật khẩu của người dùng sau khi đã được mã hóa (`hash`) để bảo mật.

- `createdAt`: Thời điểm tạo người dùng, giá trị mặc định là thời điểm hiện tại.

- `updatedAt`: Thời điểm cập nhật thông tin người dùng, được tự động cập nhật khi có thay đổi.

- `conversationsIds`: Mảng các khoá ngoại (`Foreign key`) tới các cuộc trò chuyện mà người dùng tham gia.

- `conversations`: Quan hệ với bảng `Conversation` thông qua trường `conversationsIds`, đại diện cho các cuộc trò chuyện mà người dùng tham gia.

- `seenMessageIds`: Mảng các khoá ngoại (`Foreign key`) tới các tin nhắn mà người dùng đã xem.

- `seenMessages`: Quan hệ với bảng `Message` thông qua trường `seenMessageIds`, đại diện cho các tin nhắn mà người dùng đã xem.

- `accounts`: Mảng các tài khoản liên kết với người dùng.

- `messages`: Mảng các tin nhắn mà người dùng đã gửi.

#### Account

- `id (Primary key)`: Sử dụng kiểu dữ liệu `String`, dùng để xác định duy nhất mỗi tài khoản.

- `userId`: Khoá ngoại (`Foreign key`) tới bảng `User`, cho biết người dùng liên kết với tài khoản này.

- `type`: Loại tài khoản (ví dụ: "Facebook", "Google").

- `provider`: Nhà cung cấp dịch vụ của tài khoản (ví dụ: "Facebook").

- `providerAccount`: Tên tài khoản liên kết với nhà cung cấp.

- `refresh_token`: Được sử dụng để làm mới (`refresh`) `access token` sau khi nó hết hạn. Đây là một chuỗi (`string`) chứa thông tin về việc làm mới token.

- `access_token`: Token được sử dụng để xác thực yêu cầu từ phía người dùng. Được sử dụng để truy cập tài nguyên được bảo vệ.

- `expires_at`: Thời điểm mà token (`access token` hoặc `refresh token`) hết hạn, được lưu dưới dạng `timestamp`.

- `token_type`: Loại của token, thường là "`Bearer`" để chỉ rằng đây là token Bearer.

- `scope`: Phạm vi của token, có thể chỉ định những quyền truy cập cụ thể mà token có thể sử dụng.

- `id_token`: Token JWT (`JSON Web Token`) chứa thông tin xác thực về người dùng.

- `session_state`: Trạng thái phiên làm việc, thường được sử dụng trong môi trường xác thực liên tục.

- `user`: Quan hệ với bảng `User` thông qua trường `userId`.

#### Conversation

- `id (Primary key)`: sử dụng kiểu dữ liệu `String`.

- `createdAt`: Thời điểm tạo cuộc trò chuyện, giá trị mặc định là thời điểm hiện tại.

- `lastMessageAt`: Thời điểm gửi tin nhắn cuối cùng trong cuộc trò chuyện, giá trị mặc định là thời điểm hiện tại.

- `name`: Tên của cuộc trò chuyện.

- `isGroup`: Xác định xem cuộc trò chuyện có phải là nhóm hay không.

- `messagesIds`: Mảng các khoá ngoại (`Foreign key`) tới các tin nhắn trong cuộc trò chuyện.

- `messages`: Quan hệ với bảng `Message` thông qua trường `messagesIds`, đại diện cho các tin nhắn trong cuộc trò chuyện.

- `userIds`: Mảng các khoá ngoại (`Foreign key`) tới người dùng tham gia cuộc trò chuyện.

- `users`: Quan hệ với bảng `User` thông qua trường `userIds`, đại diện cho các người dùng tham gia cuộc trò chuyện.

#### Message

- `id (Primary key)`: Sử dụng kiểu dữ liệu `String`.

- `body`: Nội dung của tin nhắn.

- `image`: Đường dẫn đến hình ảnh trong tin nhắn.

- `createdAt`: Thời điểm gửi tin nhắn, giá trị mặc định là thời điểm hiện tại.

- `seenIds`: Mảng các khoá ngoại (`Foreign key`) tới người dùng đã xem tin nhắn.

- `seen`: Quan hệ với bảng `User` thông qua trường `seenIds`, đại diện cho các người dùng đã xem tin nhắn.

- `conversationId`: Khoá ngoại tới bảng `Conversation`, cho biết cuộc trò chuyện mà tin nhắn thuộc về.

- `conversation`: Quan hệ với bảng `Conversation` thông qua trường `conversationId`, đại diện cho cuộc trò chuyện mà tin nhắn thuộc về.

- `senderId`: Khoá ngoại (`Foreign key`) tới bảng `User`, cho biết người gửi tin nhắn.

- `sender`: Quan hệ với bảng `User` thông qua trường `senderId`, đại diện cho người gửi tin nhắn.
