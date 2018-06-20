VERSION := $(shell git describe --tags --always --dirty="-dev")
DATE := $(shell date -u '+%Y-%m-%d-%H%M UTC')
Q := $(if $(VERBOSE),,@)
M = $(shell printf "\033[34;1m▶\033[0m")

all: build

clean: clean_ivi_html clean_ivi_svg clean_ivi clean_ivi_state clean_ivi_math clean_ivi_gestures

build: build_ivi build_ivi_html build_ivi_svg build_ivi_state build_ivi_math build_ivi_gestures

changelog:
	conventional-changelog -p angular -i CHANGELOG.md -s ; $(info $(M) generating CHANGELOG.md)

# ivi
clean_ivi: ; $(info $(M) cleaning ivi)
	$Q cd packages/ivi && yarn clean

build_ivi: clean_ivi ; $(info $(M) building ivi)
	$Q cd packages/ivi && yarn dist

# ivi-scheduler
clean_ivi_scheduler: ; $(info $(M) cleaning ivi-scheduler)
	$Q cd packages/ivi-scheduler && yarn clean

build_ivi_scheduler: clean_ivi_scheduler build_ivi ; $(info $(M) building ivi-scheduler)
	$Q cd packages/ivi-scheduler && yarn dist

# ivi-html
clean_ivi_html: ; $(info $(M) cleaning ivi-html)
	$Q cd packages/ivi-html && yarn clean

build_ivi_html: clean_ivi_html build_ivi ; $(info $(M) building ivi-html)
	$Q cd packages/ivi-html && yarn dist

# ivi-svg
clean_ivi_svg: ; $(info $(M) cleaning ivi-svg)
	$Q cd packages/ivi-svg && yarn clean

build_ivi_svg: clean_ivi_svg build_ivi ; $(info $(M) building ivi-svg)
	$Q cd packages/ivi-svg && yarn dist

# ivi-state
clean_ivi_state: ; $(info $(M) cleaning ivi-state)
	$Q cd packages/ivi-state && yarn clean

build_ivi_state: clean_ivi_state build_ivi ; $(info $(M) building ivi-state)
	$Q cd packages/ivi-state && yarn dist

# ivi-math
clean_ivi_math: ; $(info $(M) cleaning ivi-math)
	$Q cd packages/ivi-math && yarn clean

build_ivi_math: clean_ivi_math ; $(info $(M) building ivi-math)
	$Q cd packages/ivi-math && yarn dist

# ivi-gestures
clean_ivi_gestures: ; $(info $(M) cleaning ivi-gestures)
	$Q cd packages/ivi-gestures && yarn clean

build_ivi_gestures: clean_ivi_gestures build_ivi build_ivi_scheduler ; $(info $(M) building ivi-gestures)
	$Q cd packages/ivi-gestures && yarn dist
