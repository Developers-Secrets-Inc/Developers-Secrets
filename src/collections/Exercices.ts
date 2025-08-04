import type { CollectionConfig } from 'payload'

export const Exercices: CollectionConfig = {
  slug: 'exercices',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true, 
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the exercice',
      },
    },
    {
      name: 'difficulty',
      label: 'Difficulty',
      type: 'select',
      options: [
        { label: 'Very Easy', value: 'very_easy' },
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
        { label: 'Horrible', value: 'horrible' },
      ],
      required: true,
      defaultValue: 'medium',
      admin: {
        description: 'The difficulty level of the exercice',
        position: 'sidebar',
      },
    },
    {
      name: 'hints',
      label: 'Hints',
      type: 'array',
      admin: {
        description: 'Helpful hints for solving the exercice',
      },
      fields: [
        {
          name: 'content',
          label: 'Hint Content',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'languages',
      label: 'Languages',
      type: 'array',
      required: true,
      admin: {
        description: 'Supported languages for this exercice',
      },
      fields: [
        {
          name: 'language',
          label: 'Language',
          type: 'select',
          options: [
            { label: 'Python', value: 'python' },
            { label: 'JavaScript', value: 'javascript' },
            { label: 'TypeScript', value: 'typescript' },
          ],
          required: true,
        },
        {
          name: 'fileStructure',
          label: 'File Structure',
          type: 'array',
          admin: {
            description: 'Files and folders structure for this language',
          },
          fields: [
            {
              name: 'type',
              label: 'Type',
              type: 'select',
              options: [
                { label: 'Folder', value: 'folder' },
                { label: 'File', value: 'file' },
              ],
              required: true,
              admin: {
                description: 'Whether this is a folder or a file',
              },
            },
            {
              name: 'name',
              label: 'Name',
              type: 'text',
              required: true,
              admin: {
                description: 'Name of the file or folder',
              },
            },
            {
              name: 'parentId',
              label: 'Parent ID',
              type: 'text',
              admin: {
                description: 'ID of the parent folder (leave empty for root level)',
              },
            },
            {
              name: 'language',
              label: 'File Language',
              type: 'select',
              options: [
                { label: 'Python', value: 'python' },
                { label: 'JavaScript', value: 'javascript' },
                { label: 'TypeScript', value: 'typescript' },
                { label: 'HTML', value: 'html' },
                { label: 'CSS', value: 'css' },
                { label: 'JSON', value: 'json' },
                { label: 'Markdown', value: 'markdown' },
                { label: 'Text', value: 'text' },
              ],
              admin: {
                description: 'Programming language of the file',
                condition: (data, siblingData) => siblingData?.type === 'file',
              },
            },
            {
              name: 'content',
              label: 'File Content',
              type: 'textarea',
              admin: {
                description: 'Initial content of the file',
                condition: (data, siblingData) => siblingData?.type === 'file',
              },
            },
            {
              name: 'isReadOnly',
              label: 'Read Only',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Whether this file is read-only',
                condition: (data, siblingData) => siblingData?.type === 'file',
              },
            },
            {
              name: 'isHidden',
              label: 'Hidden',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Whether this file is hidden from the user',
                condition: (data, siblingData) => siblingData?.type === 'file',
              },
            },
            {
              name: 'isMainFile',
              label: 'Main File',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Whether this is the main file where users write their solution',
                condition: (data, siblingData) => siblingData?.type === 'file',
              },
            },
          ],
        },
        {
          name: 'testCases',
          label: 'Test Cases',
          type: 'array',
          required: true,
          admin: {
            description: 'Test cases for validating solutions in this language',
          },
          fields: [
            {
              name: 'input',
              label: 'Input',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Input data for the test case',
              },
            },
            {
              name: 'expectedOutput',
              label: 'Expected Output',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Expected output for this test case',
              },
            },
          ],
        },
      ],
    },
  ],
}
