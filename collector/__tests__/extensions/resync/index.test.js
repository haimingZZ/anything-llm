const resyncHandlers = require("../../../extensions/resync");
const PaperlessNgxLoader = require(
  "../../../utils/extensions/PaperlessNgx/PaperlessNgxLoader"
);

describe("Paperless-ngx resync", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("uses the loader default export and reads the document id from the URL host", async () => {
    const fetchDocumentContent = jest
      .spyOn(PaperlessNgxLoader.prototype, "fetchDocumentContent")
      .mockResolvedValue("document content");
    const response = {
      locals: {
        encryptionWorker: {
          expandPayload: jest.fn(
            () =>
              new URL(
                "paperless-ngx://42?baseUrl=https%3A%2F%2Fpaperless.test&token=token"
              )
          ),
        },
      },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await resyncHandlers["paperless-ngx"](
      { chunkSource: "paperless-ngx://42?payload=encrypted" },
      response
    );

    expect(fetchDocumentContent).toHaveBeenCalledWith("42");
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      content: "document content",
    });
  });
});
