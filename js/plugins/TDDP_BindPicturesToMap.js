// ====================================== =================
// TDDP_BindPicturesToMap.js
// 버전 : 1.0.7
// ====================================== =================
var 가져 오기 = 가져 오기 || {};
Imported.TDDP_BindPicturesToMap = "1.0.7";
// ====================================== =================
/ * :
 * @plugindesc 1.0.7 플러그인 그림을지도에 바인딩하고 / 또는 그려 놓은 레이어를 변경하는 명령.
 *
 * @author Tor Damian Design / Galenmereth
 * @help = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~
 * 정보
 * = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~ = ~
 *지도에 그림 붙이기 플러그인을 사용하면 그림의 이동을
 * 카메라보다는지도의 움직임. 당신은 또한 무엇을 바꿀 수 있습니다.
 * "레이어"는 그림을 그렸습니다.
 * 시차 층.
 *
 * 업데이트 및 사용하기 쉬운 설명서를 보려면 플러그인 웹 사이트를 방문하십시오.
 * http://mvplugins.tordamian.com/?p=54
 *
 * 오프라인에서 사용할 수있는 설명서 PDF도 다운로드 할 수 있습니다.
 * 하나의 문서가 깨끗하게 표시된 장소에 있다는 것은 항상
 * 가장 최근에 사용 가능한지 확인하십시오.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 이용 약관
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *이 플러그인은 비영리 및 상업적 용도로 모두 무료입니다. 참조하십시오
 * 전체 이용 약관은 http://mvplugins.tordamian.com/terms-of-use에서 확인하십시오.
 * /
(function () {
    "엄격한 사용";
    // ====================================== =================
    // Game_Interpreter - 플러그인 명령어 등록
    // ====================================== =================
    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call (this, command, args)
        var args = args || [];
        if (command === 'BindPictureToMap') this.bindPictureToMap (args [0], true, args [1]);
        if (command === 'UnbindPictureFromMap') this.bindPictureToMap (args [0], false, args [1]);
        if (command === 'ChangePictureLayer') this.changePictureLayer (args [0], args [1]);
        if (command === 'START_BindPicturesToMap') this.bindAllPicturesToMap (args);
        if (command === 'STOP_BindPicturesToMap') this.stopBindAllPicturesToMap ();
    };

    var _Game_Interpreter_clear =
            Game_Interpreter.prototype.clear;
    Game_Interpreter.prototype.clear = function () {
        _Game_Interpreter_clear.call (this);
        this._bindAllPicturesToMap = this._bindAllPicturesToMapLayer = false;
    };

    Game_Interpreter.prototype.bindPictureToMap = function (pictureId, bindToMap, layer) {
        // 첫 번째 인수를 제어합니다. pictureId
        if (! pictureId) alert ( "BindPictureToMap은 첫 번째 매개 변수가 유효한 사진 ID가되어야합니다");
        if (layer) {
            this.changePictureLayer (pictureId, layer)
        }
        var game_picture = $ gameScreen.picture (pictureId)
        // picture_sprite 업데이트
        var picture_sprite = SceneManager._scene._spriteset._pictureStorage [pictureId];
        if (picture_sprite) {
            if (game_picture && bindToMap! = game_picture._bindToMap) {
                picture_sprite.loadBitmap ();
            }
            picture_sprite.updateLayer ();
        };
        if (game_picture) game_picture._bindToMap = bindToMap;
    };

    Game_Interpreter.prototype.changePictureLayer = function (pictureId, layer) {
        var layer = 문자열 (레이어);
        if (! SceneManager._scene._spriteset._pictureContainer [layer]) {
            새로운 오류가 발생합니다 ( "BindPictureToMap :"+ layer + "는 유효한 레이어가 아닙니다.");
        }
        var game_picture = $ gameScreen.picture (pictureId)
        game_picture._layer = layer;
    }

    Game_Interpreter.prototype.bindAllPicturesToMap = function (args) {
        this._bindAllPicturesToMap = true;
        // 제 2 인수 입력, 레이어 제어
        if (args && args [0]) {
            var layer = 문자열 (args [0]);
            if (! SceneManager._scene._spriteset._pictureContainer [layer]) {
                새로운 오류를 throw합니다 ( "BindPicturesToMap :"+ args [0] + "은 (는) 유효한 레이어가 아닙니다.));
            }
            this._bindAllPicturesToMapLayer = layer;
        }
    }

    Game_Interpreter.prototype.stopBindAllPicturesToMap = function () {
        this._bindAllPicturesToMap = false;
        this._bindAllPicturesToMapLayer = false;
    }

    // ====================================== =================
    // Spriteset_Map
    // ====================================== =================
    SpriteMet.prototype.createLowerLayer = function () {
        Spriteset_Base.prototype.createLowerLayer.call (this);
        this.createPicturesLayer ( 'bottom', this._baseSprite);
        this.createParallax ();
        this.createPicturesLayer ( 'below_tilemap', this._baseSprite);
        this.createTilemap ();
        this.createPicturesLayer ( 'below_characters', this._tilemap);
        this.createCharacters ();
        this.createPicturesLayer ( 'above_characters', this._tilemap, 8);
        this.createShadow ();
        this.createPicturesLayer ( 'below_weather', this._tilemap, 8);
        this.createWeather ();
        this.createPicturesLayer ( 'top', this);
        this.createDestination ();
    };

    // 수정 됨
    Spriteset_Map.prototype.createDestination = function () {
        this._destinationSprite = 새로운 Sprite_Destination ();
        this._destinationSprite.z = 9;
        this._pictureContainer [ 'top']. addChild (this._destinationSprite);
    };

    // NEW
    Spriteset_Map.prototype.createPicturesLayer = function (레이어, 부모, z) {
        var z = z || 0;
        var container = new Sprite ();
        // 컨테이너 소품 설정
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight;
        var x = (Graphics.width - width) / 2;
        var y = (Graphics.height - height) / 2;
        container.setFrame (x, y, width, height);
        container.z = z;
        // 하위 항목에 추가
        parent.addChild (container);
        // 바인딩 추가
        this._pictureContainer [레이어] = 컨테이너;
    };

    // ALIAS
    var _Spriteset_Map_initialize =
            Spriteset_Map.prototype.initialize;
    Spriteset_Map.prototype.initialize = function () {
        this._pictureStorage = {};
        this._pictureContainer = {};
        _Spriteset_Map_initialize.call (this);
    };

    var _Spriteset_Map_update =
            Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        _Spriteset_Map_update.call (this);
        this.updatePictures ();
    }

    Spriteset_Map.prototype.updatePictures = function () {
        for (var i = 1; i <= $ gameScreen.maxPictures (); i ++) {
            var sprite = this._pictureStorage [i];
            if (! sprite.parent && sprite.picture ()) {
                this._pictureStorage [i] .update ();
            }
        }
    }

    // OVERWRITE 상속.
    Spriteset_Map.prototype.createPictures = function () {
        for (var i = 1; i <= $ gameScreen.maxPictures (); i ++) {
            this._pictureStorage [i] = 새로운 Sprite_Picture (i);
        }
    };

    // ====================================== =================
    // Sprite_Picture
    // ====================================== =================
    Sprite_Picture.prototype.updateLayer = function () {
        var picture = this.picture ();
        var parent = this.parent;
        if (picture) {
            if (picture.layer ()) {
                if (picture.layer ()! = parent) {
                    if (parent) parent.removeChild (this);
                    picture.layer (). addChild (this);
                    // pic id로 새 항목의 부모를 정렬합니다.
                    children.sort (function (a, b) {return a._pictureId-b._pictureId});
                }
            }
        }
    };

    var _Sprite_Picture_updateOther =
            Sprite_Picture.prototype.updateOther;
    Sprite_Picture.prototype.updateOther = function () {
        _Sprite_Picture_updateOther.call (this);
        this.updateLayer ();
    };

    // OVERWRITE 상속.
    Sprite_Picture.prototype.loadBitmap = function () {
        var bitmap = ImageManager.loadPicture (this.picture () ._ name);
        bitmap.addLoadListener (this.bltLoadedBitmap.bind (this, bitmap));
        반환;
    };

    // NEW
    Sprite_Picture.prototype._useLoopingBitmap = function () {
        반환 this.picture () ._ bindToMap && ($ gameMap.isLoopHorizontal () || $ gameMap.isLoopVertical ());
    }

    // NEW
    Sprite_Picture.prototype.bltLoadedBitmap = function (sourceBitmap) {
        var picture = this.picture ();
        picture.setDimensions (sourceBitmap);

        // 비트 맵 크기가 너무 큰지 확인
        if (picture._width + picture._height> 8032) {
            새로운 오류 ( "그림"+ this._pictureId + "("+ this._pictureName + ")가지도에 바인딩 된 비트 맵에 너무 큽니다.)의 높이 + 너비가 총 8032 개 미만이어야합니다.");
        }

        // 새 비트 맵의 ​​크기 설정
        var bw = (this._useLoopingBitmap () && $ gameMap.isLoopHorizontal () && picture._useHorizontalRepeat)? picture._loopWidth : picture._width;
        var bh = (this._useLoopingBitmap () && $ gameMap.isLoopVertical () && picture._useVerticalRepeat)? picture._loopHeight : picture._height;
        this.bitmap = 새로운 비트 맵 (bw, bh);

        // Blit 원래 비트 맵
        this.bitmap.blt (sourceBitmap, 0, 0, sourceBitmap.width, sourceBitmap.height, 0, 0);

        //지도 장면에서만 사용 및 수행됩니다.
        if (SceneManager._scene instanceof Scene_Map && this._useLoopingBitmap ()) {
            // 수평 오프 스크린 스크롤을 복사하여보기로 만듭니다.
            if ($ gameMap.isLoopHorizontal () && picture._useHorizontalRepeat) {
                this.bitmap.blt (sourceBitmap, 0, 0, sourceBitmap.width, sourceBitmap.height, picture._horSpacing, 0);
            }
            // 뷰로 수직 화면 끄기 스크롤을 복사합니다.
            if ($ gameMap.isLoopVertical () && picture._useVerticalRepeat) {
                this.bitmap.blt (sourceBitmap, 0, 0, sourceBitmap.width, sourceBitmap.height, 0, picture._verSpacing);
            }
            // 수평 + 수직을 스크롤하여보기로 복사합니다.
            if ($ gameMap.isLoopHorizontal () && $ gameMap.isLoopVertical ()
                    && picture._useHorizontalRepeat && picture._useVerticalRepeat) {
                this.bitmap.blt (sourceBitmap, 0, 0, sourceBitmap.width, sourceBitmap.height, picture._horSpacing, picture._verSpacing);
            }
        }

    };
    // ====================================== =================
    // Game_Picture
    // ====================================== =================
    var _Game_Picture_initBasic =
            Game_Picture.prototype.initBasic;
    Game_Picture.prototype.initBasic = function () {
        _Game_Picture_initBasic.call (this);
        this._bindToMap = $ gameMap._interpreter._bindAllPicturesToMap;
        if ($ gameMap._interpreter._bindAllPicturesToMapLayer) {
            this._layer = $ gameMap._interpreter._bindAllPicturesToMapLayer;
        } else {
            this._layer = 'top';
        }
    };
    / **
    * 현재 레이어 객체 가져 오기
    * /
    Game_Picture.prototype.layer = function () {
        if (! SceneManager._scene._spriteset)가 null을 반환하면;
        return SceneManager._scene._spriteset._pictureContainer [this._layer];
    }
    / **
    추가 기능을 설정하는 기능을 보여주는 * 확장 기능
    * /
    var _Game_Picture_show =
            Game_Picture.prototype.show;
    Game_Picture.prototype.show = function (name, origin, x, y, scaleX,
            scaleY, 불투명도, blendMode) {
        _Game_Picture_show.call (this, name, origin, x, y, scaleX,
            scaleY, 불투명도, blendMode);

        // 원점 좌표
        this._originX = this._x;
        this._originY = this._y;

        //지도 장면에서만 사용 및 수행됩니다.
        if (SceneManager._scene instanceof Scene_Map) {
            //지도의 그리기 시작을 오프셋하는 해상도의 오프셋을 매핑합니다. 사진을지도에 바인딩 할 때만 사용됩니다.
            this._mapOffsX = Math.max (SceneManager._screenWidth - ($ gameMap.width () * $ gameMap.tileWidth ()), 0);
            this._mapOffsY = Math.max (SceneManager._screenHeight - ($ gameMap.height () * $ gameMap.tileHeight ()), 0);
        }
    };
    / **
    * 비트 맵을 기준으로 치수를 설정합니다. Sprite_Picture에 의해 호출 됨
    * /
    Game_Picture.prototype.setDimensions = function (비트 맵) {
        this._width = bitmap.width;
        this._height = bitmap.height;

        //지도 장면에서만 사용 및 수행됩니다.
        if (SceneManager._scene instanceof Scene_Map) {
            // 반복되는 텍스처의 수평 및 수직 간격
            this._horSpacing = $ gameMap.width () * $ gameMap.tileWidth ();
            this._verSpacing = $ gameMap.height () * $ gameMap.tileHeight ();
        }

        // 수평 및 수직 반복이 필요한지 확인
        this._useHorizontalRepeat = this._width <this._horSpacing * 2;
        this._useVerticalRepeat = this._height <this._verSpacing * 2;

        // 반복을 기반으로 요청한 비트 맵 너비를 설정합니다.
        this._loopWidth = this._useHorizontalRepeat? this._horSpacing * 2 : this._width;
        this._loopHeight = this._useVerticalRepeat? this._verSpacing * 2 : this._height;
    }
    / **
    *지도에 그림을 바인딩 할 때 updateMove 확장 기능
    * /
    var _Game_Picture_updateMove =
            Game_Picture.prototype.updateMove;
    Game_Picture.prototype.updateMove = function () {
        _Game_Picture_updateMove.call (this);
        if (this.bindToMap) {
            var mw = ($ gameMap.width () * $ gameMap.tileWidth ());
            var mh = ($ gameMap.height () * $ gameMap.tileHeight ());
            var dx = Math.abs ($ gameMap.displayX ());
            var dy = Math.abs ($ gameMap.displayY ());
            var ox = dx * $ gameMap.tileWidth ();
            var oy = dy * $ gameMap.tileHeight ();
            this._x = this._originX-ox;
            this._y = this._originY - oy;
            if (this._useHorizontalRepeat && ox> = mw) {
                this._x + = mw;
            } else {
                this._x + = this._mapOffsX;
            }
            if (this._useVerticalRepeat && oy> = mh) {
                this._y + = mh;
            } else {
                this._y + = this._mapOffsY;
            }
        }
    };
    // ====================================== =================
    // Game_Picture
    // ====================================== =================
    / **
    JS의 반올림 오류를 막기 위해 displayX의 10 진수 값을 수정했습니다.
    * /
    Game_Map.prototype.displayX = function () {
        return Math.ceil10 (this._displayX, -8);
    };
    / **
    * JS 반올림 오류를 방지하기 위해 Y의 반환 된 십진수 값을 표시하도록 수정했습니다.
    * /
    Game_Map.prototype.displayY = function () {
        return Math.ceil10 (this._displayY, -8);
    };
    // ====================================== =================
    // 수학 추가
    // ====================================== =================
    / **
    * 숫자의 십진수 조정.
    *
    * @param {String} type 조정 유형입니다.
    * @param {Number} value 숫자입니다.
    * @param {Integer} exp 지수 (조정베이스의 10 로그).
    * @returns {Number} 조정 된 값입니다.
    * /
    함수 decimalAdjust (type, value, exp) {
        // exp가 정의되지 않았거나 0 인 경우 ...
        if (typeof exp === 'undefined'|| + exp === 0) {
            return Math [유형] (값);
        }
        값 = + 값;
        exp = + exp;
        // 값이 숫자가 아니거나 exp가 정수가 아닌 경우 ...
        if (isNaN (value) ||! (typeof exp === 'number'&& exp % 1 === 0)) {
            NaN을 반환합니다.
        }
        // Shift
        value = value.toString (). split ( 'e');
        value = Math [type] (+ value [0] + 'e'+ (value [1]?) (+ value [1] - exp) : -exp)));
        // 뒤로 이동
        value = value.toString (). split ( 'e');
        return + (value [0] + 'e'+ (value [1]?) (+ value [1] + exp) : exp));
    }

    // Decimal ceil
    if (! Math.ceil10) {
        Math.ceil10 = function (value, exp) {
            return decimalAdjust ( 'ceil', value, exp);
        };
    }

}) ();