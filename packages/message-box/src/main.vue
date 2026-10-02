<template>
  <transition name="msgbox-fade">
    <div class="rumo-message-box__wrapper"
      :class="[$RUMO.namespaceClass]"
      tabindex="-1"
      v-show="visible"
      @click.self="handleWrapperClick"
      role="dialog"
      aria-modal="true"
      :aria-label="title || 'dialog'"
    >
      <div
        class="rumo-message-box"
        :style="{ width }"
        :class="[
          customClass,
          center && 'rumo-message-box--center',
          titleStatus && 'rumo-message-box--title-status',
          type && `rumo-message-box--status`,
          variant && `rumo-message-box--variant-${variant}`,
          variant && 'rumo-dash',
          variant && dark ? 'is-dark' : '',
        ]"
      >
        <div class="rumo-message-box__header" v-if="title !== null">
          <div class="rumo-message-box__title">
            <div
              class="rumo-message-box__status"
              :class="['rumo-icons', typeClass]"
              v-if="typeClass && titleStatus"
            ></div>
            <span>{{ title }}</span>
          </div>
          <button
            type="button"
            class="rumo-message-box__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="
              handleAction(distinguishCancelAndClose ? 'close' : 'cancel')
            "
            @keydown.enter="
              handleAction(distinguishCancelAndClose ? 'close' : 'cancel')
            "
          >
            <i
              class="rumo-message-box__close rumo-icons icon-close rumo-icons-18"
            ></i>
          </button>
        </div>
        <div class="rumo-message-box__content" v-if="message !== ''">
          <div
            class="rumo-message-box__status"
            :class="['rumo-icons', typeClass]"
            v-if="typeClass && !titleStatus"
          ></div>
          <div class="rumo-message-box__message">
            <slot>
              <p v-if="!dangerouslyUseHTMLString">{{ message }}</p>
              <p v-else v-html="message"></p>
            </slot>
          </div>
          <div class="rumo-message-box__input" v-show="showInput">
            <rumo-input
              v-model="inputValue"
              :type="inputType"
              @compositionstart.native="handleComposition"
              @compositionupdate.native="handleComposition"
              @compositionend.native="handleComposition"
              @keyup.enter.native="handleKeyup"
              :placeholder="inputPlaceholder"
              ref="input"
            ></rumo-input>
            <div
              class="rumo-message-box__errormsg"
              :style="{
                visibility: !!editorErrorMessage ? 'visible' : 'hidden',
              }"
            >
              {{ editorErrorMessage }}
            </div>
          </div>
        </div>
        <div class="rumo-message-box__btns">
          <rumo-button
            :loading="cancelButtonLoading"
            :class="[cancelButtonClasses]"
            :variant="variant === 'card' ? 'secondary' : ''"
            v-show="showCancelButton"
            :round="roundButton"
            size="small"
            @click.native="handleAction('cancel')"
            @keydown.enter="handleAction('cancel')"
          >
            {{ cancelButtonText || t("rumo.messagebox.cancel") }}
          </rumo-button>
          <rumo-button
            :loading="confirmButtonLoading"
            ref="confirm"
            :class="[confirmButtonClasses]"
            :variant="variant === 'card' ? 'primary' : ''"
            v-show="showConfirmButton"
            :round="roundButton"
            size="small"
            @click.native="handleAction('confirm')"
            @keydown.enter="handleAction('confirm')"
          >
            {{ confirmButtonText || t("rumo.messagebox.confirm") }}
          </rumo-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import Popup from "rumo-ui/src/utils/popup";
import Locale from "rumo-ui/src/mixins/locale";
import RumoInput from "rumo-ui/packages/input";
import RumoButton from "rumo-ui/packages/button";
import { addClass, removeClass } from "rumo-ui/src/utils/dom";
import { t } from "rumo-ui/src/locale";
import Dialog from "rumo-ui/src/utils/aria-dialog";

let messageBox;
let typeMap = {
  success: "check-fill",
  info: "info-fill",
  warning: "warning-fill",
  error: "close-fill",
};

export default {
  mixins: [Popup, Locale],

  props: {
    width: {
      type: String,
      default: "420px",
    },
    customClass: {
      type: String,
      default: "",
    },
    modal: {
      default: true,
    },
    lockScroll: {
      default: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    closeOnClickModal: {
      default: true,
    },
    closeOnPressEscape: {
      default: true,
    },
    closeOnHashChange: {
      default: true,
    },
    center: {
      default: false,
      type: Boolean,
    },
    titleStatus: {
      default: true,
      type: Boolean,
    },
    roundButton: {
      default: false,
      type: Boolean,
    },
  },

  components: {
    RumoInput,
    RumoButton,
  },

  computed: {
    typeClass() {
      return this.type && typeMap[this.type]
        ? `icon-${typeMap[this.type]}`
        : "";
    },

    confirmButtonClasses() {
      return `rumo-button--primary ${this.confirmButtonClass}`;
    },
    cancelButtonClasses() {
      return `${this.cancelButtonClass}`;
    },
  },

  methods: {
    handleComposition(event) {
      if (event.type === "compositionend") {
        setTimeout(() => {
          this.isOnComposition = false;
        }, 100);
      } else {
        this.isOnComposition = true;
      }
    },
    handleKeyup() {
      !this.isOnComposition && this.handleAction("confirm");
    },
    getSafeClose() {
      const currentId = this.uid;
      return () => {
        this.$nextTick(() => {
          if (currentId === this.uid) this.doClose();
        });
      };
    },
    doClose() {
      if (!this.visible) return;
      this.visible = false;
      this._closing = true;

      this.onClose && this.onClose();
      messageBox.closeDialog(); // 解绑
      if (this.lockScroll) {
        setTimeout(this.restoreBodyStyle, 200);
      }
      this.opened = false;

      this.doAfterClose();
      setTimeout(() => {
        if (this.action) this.callback(this.action, this);
      });
    },

    handleWrapperClick() {
      if (this.closeOnClickModal) {
        this.handleAction(this.distinguishCancelAndClose ? "close" : "cancel");
      }
    },

    handleAction(action) {
      if (this.$type === "prompt" && action === "confirm" && !this.validate()) {
        return;
      }
      this.action = action;
      if (typeof this.beforeClose === "function") {
        this.close = this.getSafeClose();
        this.beforeClose(action, this, this.close);
      } else {
        this.doClose();
      }
    },

    validate() {
      if (this.$type === "prompt") {
        var inputPattern = this.inputPattern;
        if (inputPattern && !inputPattern.test(this.inputValue || "")) {
          this.editorErrorMessage =
            this.inputErrorMessage || t("rumo.messagebox.error");
          addClass(this.getInputElement(), "invalid");
          return false;
        }
        var inputValidator = this.inputValidator;
        if (typeof inputValidator === "function") {
          var validateResult = inputValidator(this.inputValue);
          if (validateResult === false) {
            this.editorErrorMessage =
              this.inputErrorMessage || t("rumo.messagebox.error");
            addClass(this.getInputElement(), "invalid");
            return false;
          }
          if (typeof validateResult === "string") {
            this.editorErrorMessage = validateResult;
            return false;
          }
        }
      }
      this.editorErrorMessage = "";
      removeClass(this.getInputElement(), "invalid");
      return true;
    },
    getFirstFocus() {
      const btn = this.$el.querySelector(".rumo-message-box__btns .rumo-button");
      const title = this.$el.querySelector(
        ".rumo-message-box__btns .rumo-message-box__title"
      );
      return btn || title;
    },
    getInputElement() {
      const inputRefs = this.$refs.input.$refs;
      return inputRefs.input || inputRefs.textarea;
    },
  },

  watch: {
    inputValue: {
      immediate: true,
      handler(val) {
        this.$nextTick((_) => {
          if (this.$type === "prompt" && val !== null) {
            this.validate();
          }
        });
      },
    },

    visible(val) {
      if (val) {
        this.uid++;
        if (this.$type === "alert" || this.$type === "confirm") {
          this.$nextTick(() => {
            this.$refs.confirm.$el.focus();
          });
        }
        this.focusAfterClosed = document.activeElement;
        messageBox = new Dialog(
          this.$el,
          this.focusAfterClosed,
          this.getFirstFocus()
        );
      }

      // prompt
      if (this.$type !== "prompt") return;
      if (val) {
        setTimeout(() => {
          if (this.$refs.input && this.$refs.input.$el) {
            this.getInputElement().focus();
          }
        }, 500);
      } else {
        this.editorErrorMessage = "";
        removeClass(this.getInputElement(), "invalid");
      }
    },
  },

  mounted() {
    this.$nextTick(() => {
      if (this.closeOnHashChange) {
        window.addEventListener("hashchange", this.close);
      }
    });
  },

  beforeDestroy() {
    if (this.closeOnHashChange) {
      window.removeEventListener("hashchange", this.close);
    }
    setTimeout(() => {
      messageBox.closeDialog();
    });
  },

  data() {
    return {
      uid: 1,
      title: undefined,
      message: "",
      type: "",
      // customClass: '',
      showInput: false,
      inputValue: null,
      inputPlaceholder: "",
      inputType: "text",
      inputPattern: null,
      inputValidator: null,
      inputErrorMessage: "",
      showConfirmButton: true,
      showCancelButton: false,
      action: "",
      confirmButtonText: "",
      cancelButtonText: "",
      confirmButtonLoading: false,
      cancelButtonLoading: false,
      confirmButtonClass: "",
      confirmButtonDisabled: false,
      cancelButtonClass: "",
      editorErrorMessage: null,
      callback: null,
      dangerouslyUseHTMLString: false,
      focusAfterClosed: null,
      isOnComposition: false,
      distinguishCancelAndClose: false,
      variant: '',
      dark: false,
    };
  },
};
</script>
