#valid platform options: linux, win32, darwin

SRC_DIR            := $(realpath $(dir $(realpath $(lastword $(MAKEFILE_LIST)))))
BUILD_DIR_YARN     := $(SRC_DIR)/dist
BUILD_DIR_ELECTRON := $(SRC_DIR)/build
PLATFORM           := linux
ARCH               := x64
ELECTRON_VER       := 17.1.2
APP_TITLE          := OpenDeckConfigurator
PACKAGE_TITLE      := $(APP_TITLE)-$(PLATFORM)-$(ARCH)

dev:
	@yarn
	@yarn dev

prod:
	@yarn
	@yarn build

pkg:
	@mkdir -p $(BUILD_DIR_ELECTRON)
	@cd $(BUILD_DIR_YARN) && \
	cp $(SRC_DIR)/package.json ./ && \
	cp $(SRC_DIR)/main.js ./ && \
	sed -i 's#/_assets#_assets#g' index.html && \
	electron-packager ./ $(APP_TITLE) --platform=$(PLATFORM) --arch=$(ARCH) --electron-version=$(ELECTRON_VER) --overwrite && \
	zip -r $(PACKAGE_TITLE).zip $(PACKAGE_TITLE)/ && \
	mv $(PACKAGE_TITLE).zip $(BUILD_DIR_ELECTRON)/

clean:
	@echo Cleaning up.
	@rm -rf $(BUILD_DIR_YARN)/ $(BUILD_DIR_ELECTRON)/

#debugging
print-%:
	@echo '$($*)'