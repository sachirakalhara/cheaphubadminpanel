// ** React Imports
import React, {useEffect, useRef, useState} from 'react'

// ** Third Party Components
import {ContentState, convertToRaw, EditorState} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './html-editor.scss'

/**
 * A rich-text (WYSIWYG) editor that plugs into react-hook-form Controller.
 * Stores its value as an HTML string (what the customer-facing site renders).
 *
 * - `value`    : current HTML string from the form field
 * - `onChange` : called with the new HTML string (empty string when no text)
 * - `invalid`  : red border when validation fails
 */
const HtmlEditor = ({value, onChange, invalid, placeholder}) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    // Only seed the editor from incoming HTML once (edit mode loads async).
    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current && value) {
            const blocks = htmlToDraft(value)
            if (blocks) {
                const contentState = ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap)
                setEditorState(EditorState.createWithContent(contentState))
            }
            initialized.current = true
        }
    }, [value])

    const handleChange = (state) => {
        setEditorState(state)
        const content = state.getCurrentContent()
        // Keep the required-field check working: report '' when there is no text.
        const html = content.hasText() ? draftToHtml(convertToRaw(content)) : ''
        if (onChange) onChange(html)
    }

    return (
        <div className={`html-editor-wrapper${invalid ? ' html-editor-invalid' : ''}`}>
            <Editor
                editorState={editorState}
                onEditorStateChange={handleChange}
                placeholder={placeholder}
                wrapperClassName='html-editor-rdw-wrapper'
                toolbarClassName='html-editor-rdw-toolbar'
                editorClassName='html-editor-rdw-editor'
                toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'history'],
                    inline: {
                        inDropdown: false,
                        options: ['bold', 'italic', 'underline', 'strikethrough']
                    }
                }}
            />
        </div>
    )
}

export default HtmlEditor
