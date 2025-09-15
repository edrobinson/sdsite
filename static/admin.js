/*
This script handles the admin page buttons
*/

function editorDisplay(page, event)
{
    event.stopPropagation()

    const page_map = {"books": '/booksmgr',
                                    "prose": '/prosemgr',
                                    "poetry": '/poetrymgr',
                                    "contacts": '/contactsmgr',
                                    "blog": '/blogmgr',
                                    }
    
    const url = page_map[page]
    fetch(url)
}
