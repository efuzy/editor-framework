var Ipc = require('ipc');
var BrowserWindow = require('browser-window');
var Menu = require('menu');
var Path = require('fire-path');

function getDefaultMainMenu () {
    return [
        // Help
        {
           label: 'Help',
           id: 'help',
           submenu: [
           ]
        },

        // Fireball
        {
            label: 'Editor Framework',
            position: 'before=help',
            submenu: [
                {
                    label: 'Hide',
                    accelerator: 'Command+H',
                    selector: 'hide:'
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Shift+H',
                    selector: 'hideOtherApplications:'
                },
                {
                    label: 'Show All',
                    selector: 'unhideAllApplications:'
                },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: function () {
                        Editor.Window.saveLayout();
                        Editor.quit();
                    }
                },
            ]
        },

        // View
        {
            label: 'View',
            id: 'view',
            submenu: [
            ]
        },

        // Window
        {
            label: 'Window',
            id: 'window',
            submenu: Editor.isDarwin ?
            [
                {
                    label: 'Minimize',
                    accelerator: 'Command+M',
                    selector: 'performMiniaturize:',
                },
                {
                    label: 'Close',
                    accelerator: 'Command+W',
                    selector: 'performClose:',
                },
                { type: 'separator' },
                {
                    label: 'Bring All to Front',
                    selector: 'arrangeInFront:'
                },
            ] :
            [
                {
                    label: "Close",
                    accelerator: 'Command+W',
                    click: function () {
                        Editor.Window.saveLayout();
                        Editor.quit();
                    },
                }
            ]
        },

        // Developer
        {
            label: 'Developer',
            id: 'developer',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: function() {
                        BrowserWindow.getFocusedWindow().reloadIgnoringCache();
                        Editor.reloadPlayground();
                    }
                },
                {
                    label: 'Reload Playground',
                    accelerator: 'CmdOrCtrl+Shift+R',
                    click: function() {
                        Editor.reloadPlayground();
                    }
                },
                {
                    label: 'Developer Tools',
                    accelerator: 'CmdOrCtrl+Alt+I',
                    click: function() { BrowserWindow.getFocusedWindow().openDevTools(); }
                },
                // {
                //     label: 'Inspect Element',
                //     accelerator: 'CmdOrCtrl+Shift+C',
                //     click: function() { BrowserWindow.getFocusedWindow().inspectElement(); }
                // },
                { type: 'separator' },
                {
                    label: 'Simple Tests',
                    submenu: [
                        {
                            label: 'Throw an Uncaught Exception',
                            click: function() {
                                throw new Error('editor-framework Unknown Error');
                            }
                        },
                    ],
                },
                {
                    label: 'Ipc Tests',
                    submenu: [
                        {
                            label: 'send2panel \'foo:bar\' foobar@editor',
                            click: function() {
                                Editor.sendToPanel( "foobar@editor", "foo:bar" );
                            }
                        },
                    ],
                },
            ]
        },
    ];
}

var _mainMenu = new Editor.Menu( getDefaultMainMenu() );

var MainMenu = {};

MainMenu.apply = function () {
    Menu.setApplicationMenu(_mainMenu.nativeMenu);
};

MainMenu.reset = function () {
    _mainMenu.reset( getDefaultMainMenu() );
    MainMenu.apply();
};

MainMenu.add = function ( path, template ) {
    if ( _mainMenu.add( path, template ) ) {
        MainMenu.apply();
    }
};

MainMenu.set = function ( path, options ) {
    if ( _mainMenu.set( path, options ) ) {
        MainMenu.apply();
    }
};

// ipc
Ipc.on('main-menu:reset', function () {
    MainMenu.reset();
});

Ipc.on('main-menu:add', function ( path, template ) {
    MainMenu.add( path, template );
});

Ipc.on('main-menu:set', function ( path, options ) {
    MainMenu.set( path, options );
});

module.exports = MainMenu;