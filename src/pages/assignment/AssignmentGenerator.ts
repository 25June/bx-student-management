import {
  AlignmentType,
  Document,
  HeadingLevel,
  Paragraph,
  LevelFormat,
  convertInchesToTwip
} from "docx";

const AssessmentType = 'Kiem Tra 15 phut'
const caption1 = 'Ban Giao Ly Giao Xu Binh Xuyen'

export class DocumentCreator {
  public create(): Document {
    const document = new Document({
      numbering: {
        config: [
          {
            levels: [
              {
                level: 0,
                format: LevelFormat.UPPER_ROMAN,
                text: "%1.",
                alignment: AlignmentType.START,
                style: {
                  paragraph: {
                    indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.18) },
                  },
                },
              },
              {
                level: 1,
                format: LevelFormat.DECIMAL,
                text: "%2.",
                alignment: AlignmentType.START,
                style: {
                  paragraph: {
                    indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.18) },
                  },
                },
              },
              {
                level: 2,
                format: LevelFormat.UPPER_LETTER,
                text: "%3.",
                alignment: AlignmentType.START,
                style: {
                  paragraph: {
                    indent: { left: convertInchesToTwip(0.75), hanging: convertInchesToTwip(0.18) },
                  },
                },
              },
            ],
            reference: "trac-nghiem-section-reference",
          },
        ],
      },
      sections: [{
        children: [
          this.createHeading(AssessmentType),
          this.createHeading(caption1),
          new Paragraph({
            text: "Section 1",
            numbering: {
              reference: "trac-nghiem-section-reference",
              level: 0,
            },
            contextualSpacing: true,
          }),
          new Paragraph({
            text: "Question 1",
            numbering: {
              reference: "trac-nghiem-section-reference",
              level: 1,
            },
          }),
          new Paragraph({
            text: "Answer 1",
            numbering: {
              reference: "trac-nghiem-section-reference",
              level: 2,
            },
          }),
          new Paragraph({
            text: "Answer 2",
            numbering: {
              reference: "trac-nghiem-section-reference",
              level: 2,
            },
          }),
          new Paragraph({
            text: "Question 2",
            numbering: {
              reference: "trac-nghiem-section-reference",
              level: 1,
            },
          }),
          new Paragraph({
            text: "Answer 1",
            numbering: {
              reference: "trac-nghiem-section-reference",
              level: 2,
            },
          }),
          new Paragraph({
            text: "Answer 2",
            numbering: {
              reference: "trac-nghiem-section-reference",
              level: 2,
            },
          }),
          new Paragraph({
            text: "Section 2",
            numbering: {
              reference: "trac-nghiem-section-reference",
              level: 0,
            },
          }),
          new Paragraph({
            text: "Question 1",
            numbering: {
              reference: "trac-nghiem-section-reference",
              level: 1,
            },
          }),
          new Paragraph({
            text: "Answer 1",
            numbering: {
              reference: "trac-nghiem-section-reference",
              level: 2,
            },
          }),
          new Paragraph({
            text: "Answer 2",
            numbering: {
              reference: "trac-nghiem-section-reference",
              level: 2,
            },
          }),
          new Paragraph({
            text: "Question 2",
            numbering: {
              reference: "trac-nghiem-section-reference",
              level: 1,
            },
          }),
          new Paragraph({
            text: "Answer 1",
            numbering: {
              reference: "trac-nghiem-section-reference",
              level: 2,
            },
          }),
          new Paragraph({
            text: "Answer 2",
            numbering: {
              reference: "trac-nghiem-section-reference",
              level: 2,
            },
          }),
        ]
      }]
    })
    return document
  }

  public createHeading(text: string): Paragraph {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_1,
      thematicBreak: false
    });
  }
}