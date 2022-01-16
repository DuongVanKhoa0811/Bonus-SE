/*
Copyright 2015, 2016 OpenMarket Ltd
Copyright 2018-2019 New Vector Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { ComponentType } from 'react';
import { MatrixClient } from "matrix-js-sdk/src/client";

import Field from "../elements/Field";
import { MatrixClientPeg } from "../../../MatrixClientPeg";
import AccessibleButton from '../elements/AccessibleButton';
import Spinner from '../elements/Spinner';
import withValidation, { IFieldState, IValidationResult } from '../elements/Validation';
import { _t, _td } from '../../../languageHandler';
import Modal from "../../../Modal";
import PassphraseField from "../auth/PassphraseField";
import CountlyAnalytics from "../../../CountlyAnalytics";
import { replaceableComponent } from "../../../utils/replaceableComponent";
import { PASSWORD_MIN_SCORE } from '../auth/RegistrationForm';
import SetEmailDialog from "../dialogs/SetEmailDialog";
import QuestionDialog from "../dialogs/QuestionDialog";

const FIELD_OLD_PASSWORD = 'field_old_password';
const FIELD_NEW_PASSWORD = 'field_new_password';
const FIELD_NEW_PASSWORD_CONFIRM = 'field_new_password_confirm';

enum Phase {
    Edit = "edit",
    Uploading = "uploading",
    Error = "error",
}

interface IProps {
    onFinished?: ({ didSetEmail: boolean }?) => void;
    onError?: (error: {error: string}) => void;
    rowClassName?: string;
    buttonClassName?: string;
    buttonKind?: string;
    buttonLabel?: string;
    confirm?: boolean;
    // Whether to autoFocus the new password input
    autoFocusNewPasswordInput?: boolean;
    className?: string;
    shouldAskForEmail?: boolean;
}

interface IState {
    fieldValid: {};
    phase: Phase;
    oldPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}

@replaceableComponent("views.settings.ChangePassword")
export default class ChangePassword extends React.Component<IProps, IState> {
    public static defaultProps: Partial<IProps> = {
        onFinished() {},
        onError() {},

        confirm: true,
    };

    constructor(props: IProps) {
        super(props);

        this.state = {
            fieldValid: {},
            phase: Phase.Edit,
            oldPassword: "",
            newPassword: "",
            newPasswordConfirm: "",
        };
    }

    private onChangePassword(oldPassword: string, newPassword: string): void {
        const cli = MatrixClientPeg.get();

        if (!this.props.confirm) {
            this.changePassword(cli, oldPassword, newPassword);
            return;
        }

        Modal.createTrackedDialog('Change Password', '', QuestionDialog, {
            title: _t("Warning!"),
            description:
                <div>
                    { _t(
                        'Changing password will currently reset any end-to-end encryption keys on all sessions, ' +
                        'making encrypted chat history unreadable, unless you first export your room keys ' +
                        'and re-import them afterwards. ' +
                        'In future this will be improved.',
                    ) }
                    { ' ' }
                    <a href="https://github.com/vector-im/element-web/issues/2671" target="_blank" rel="noreferrer noopener">
                        https://github.com/vector-im/element-web/issues/2671
                    </a>
                </div>,
            button: _t("Continue"),
            extraButtons: [
                <button
                    key="exportRoomKeys"
                    className="mx_Dialog_primary"
                    onClick={this.onExportE2eKeysClicked}
                >
                    { _t('Export E2E room keys') }
                </button>,
            ],
            onFinished: (confirmed) => {
                if (confirmed) {
                    this.changePassword(cli, oldPassword, newPassword);
                }
            },
        });
    }

    private changePassword(cli: MatrixClient, oldPassword: string, newPassword: string): void {
        const authDict = {
            type: 'm.login.password',
            identifier: {
                type: 'm.id.user',
                user: cli.credentials.userId,
            },
            // TODO: Remove `user` once servers support proper UIA
            // See https://github.com/matrix-org/synapse/issues/5665
            user: cli.credentials.userId,
            password: oldPassword,
        };

        this.setState({
            phase: Phase.Uploading,
        });

        cli.setPassword(authDict, newPassword).then(() => {
            if (this.props.shouldAskForEmail) {
                return this.optionallySetEmail().then((confirmed) => {
                    this.props.onFinished({
                        didSetEmail: confirmed,
                    });
                });
            } else {
                this.props.onFinished();
            }
        }, (err) => {
            this.props.onError(err);
        }).finally(() => {
            this.setState({
                phase: Phase.Edit,
                oldPassword: "",
                newPassword: "",
                newPasswordConfirm: "",
            });
        });
    }

    private checkPassword(oldPass: string, newPass: string, confirmPass: string): {error: string} {
        if (newPass !== confirmPass) {
            return {
                error: _t("New passwords don't match"),
            };
        } else if (!newPass || newPass.length === 0) {
            return {
                error: _t("Passwords can't be empty"),
            };
        }
    }

    private optionallySetEmail(): Promise<boolean> {
        // Ask for an email otherwise the user has no way to reset their password
        const modal = Modal.createTrackedDialog('Do you want to set an email address?', '', SetEmailDialog, {
            title: _t('Do you want to set an email address?'),
        });
        return modal.finished.then(([confirmed]) => confirmed);
    }

    private onExportE2eKeysClicked = (): void => {
        Modal.createTrackedDialogAsync('Export E2E Keys', 'Change Password',
            import(
                '../../../async-components/views/dialogs/security/ExportE2eKeysDialog'
            ) as unknown as Promise<ComponentType<{}>>,
            {
                matrixClient: MatrixClientPeg.get(),
            },
        );
    };

    private markFieldValid(fieldID: string, valid: boolean): void {
        const { fieldValid } = this.state;
        fieldValid[fieldID] = valid;
        this.setState({
            fieldValid,
        });
    }

    private onChangeOldPassword = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            oldPassword: ev.target.value,
        });
    };

    private onOldPasswordValidate = async (fieldState: IFieldState): Promise<IValidationResult> => {
        const result = await this.validateOldPasswordRules(fieldState);
        this.markFieldValid(FIELD_OLD_PASSWORD, result.valid);
        return result;
    };

    private validateOldPasswordRules = withValidation({
        rules: [
            {
                key: "required",
                test: ({ value, allowEmpty }) => allowEmpty || !!value,
                invalid: () => _t("Passwords can't be empty"),
            },
        ],
    });

    private onChangeNewPassword = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            newPassword: ev.target.value,
        });
    };

    private onNewPasswordValidate = (result: IValidationResult): void => {
        this.markFieldValid(FIELD_NEW_PASSWORD, result.valid);
    };

    private onChangeNewPasswordConfirm = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            newPasswordConfirm: ev.target.value,
        });
    };

    private onNewPasswordConfirmValidate = async (fieldState: IFieldState): Promise<IValidationResult> => {
        const result = await this.validatePasswordConfirmRules(fieldState);
        this.markFieldValid(FIELD_NEW_PASSWORD_CONFIRM, result.valid);
        return result;
    };

    private validatePasswordConfirmRules = withValidation<this>({
        rules: [
            {
                key: "required",
                test: ({ value, allowEmpty }) => allowEmpty || !!value,
                invalid: () => _t("Confirm password"),
            },
            {
                key: "match",
                test({ value }) {
                    return !value || value === this.state.newPassword;
                },
                invalid: () => _t("Passwords don't match"),
            },
        ],
    });

    private onClickChange = async (ev: React.MouseEvent | React.FormEvent): Promise<void> => {
        ev.preventDefault();

        const allFieldsValid = await this.verifyFieldsBeforeSubmit();
        if (!allFieldsValid) {
            CountlyAnalytics.instance.track("onboarding_registration_submit_failed");
            return;
        }

        const oldPassword = this.state.oldPassword;
        const newPassword = this.state.newPassword;
        const confirmPassword = this.state.newPasswordConfirm;
        const err = this.checkPassword(
            oldPassword, newPassword, confirmPassword,
        );
        if (err) {
            this.props.onError(err);
        } else {
            this.onChangePassword(oldPassword, newPassword);
        }
    };

    private async verifyFieldsBeforeSubmit(): Promise<boolean> {
        // Blur the active element if any, so we first run its blur validation,
        // which is less strict than the pass we're about to do below for all fields.
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement) {
            activeElement.blur();
        }

        const fieldIDsInDisplayOrder = [
            FIELD_OLD_PASSWORD,
            FIELD_NEW_PASSWORD,
            FIELD_NEW_PASSWORD_CONFIRM,
        ];

        // Run all fields with stricter validation that no longer allows empty
        // values for required fields.
        for (const fieldID of fieldIDsInDisplayOrder) {
            const field = this[fieldID];
            if (!field) {
                continue;
            }
            // We must wait for these validations to finish before queueing
            // up the setState below so our setState goes in the queue after
            // all the setStates from these validate calls (that's how we
            // know they've finished).
            await field.validate({ allowEmpty: false });
        }

        // Validation and state updates are async, so we need to wait for them to complete
        // first. Queue a `setState` callback and wait for it to resolve.
        await new Promise<void>((resolve) => this.setState({}, resolve));

        if (this.allFieldsValid()) {
            return true;
        }

        const invalidField = this.findFirstInvalidField(fieldIDsInDisplayOrder);

        if (!invalidField) {
            return true;
        }

        // Focus the first invalid field and show feedback in the stricter mode
        // that no longer allows empty values for required fields.
        invalidField.focus();
        invalidField.validate({ allowEmpty: false, focused: true });
        return false;
    }

    private allFieldsValid(): boolean {
        const keys = Object.keys(this.state.fieldValid);
        for (let i = 0; i < keys.length; ++i) {
            if (!this.state.fieldValid[keys[i]]) {
                return false;
            }
        }
        return true;
    }

    private findFirstInvalidField(fieldIDs: string[]): Field {
        for (const fieldID of fieldIDs) {
            if (!this.state.fieldValid[fieldID] && this[fieldID]) {
                return this[fieldID];
            }
        }
        return null;
    }

    public render(): JSX.Element {
        const rowClassName = this.props.rowClassName;
        const buttonClassName = this.props.buttonClassName;

        switch (this.state.phase) {
            case Phase.Edit:
                return (
                    <form className={this.props.className} onSubmit={this.onClickChange}>
                    </form>
                );
            case Phase.Uploading:
                return (
                    <div className="mx_Dialog_content">
                        <Spinner />
                    </div>
                );
        }
    }
}
