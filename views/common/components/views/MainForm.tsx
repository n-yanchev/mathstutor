import React from "react"
import type {ReactNode} from "react";
import {makeStyles} from "@material-ui/core";
import FormHeader from "./FormHeader";
import ConfirmButton from "./ConfirmButton";

const useStyles = makeStyles({
    confirmButton: {
        marginTop: 20,
        marginBottom: 20
    },
    formHeader: {
        marginTop: 20,
        marginBottom: 35
    }
})

type Props = {
    header: string,
    children: ReactNode | Array<ReactNode>,
    confirmDisabled?: boolean,
    onConfirm: () => void,
    confirmButtonTitle?: string
}

export default function MainForm(props: Props) {

    const {header, confirmDisabled, children, onConfirm, confirmButtonTitle} = props
    const classes = useStyles()

    return (
        <>
            <FormHeader className={classes.formHeader}>{header}</FormHeader>
            {children}
            <ConfirmButton className={classes.confirmButton} disabled={confirmDisabled} onClick={onConfirm}>
                {confirmButtonTitle}
            </ConfirmButton>
        </>
    )
}