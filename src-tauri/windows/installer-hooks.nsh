; Aborts installation on Windows older than 10 v1709 (Fall Creators Update,
; build 16299). Same floor as the bundled Python core compiled by Nuitka.
; WinVer.nsh ships with NSIS and exposes ${AtLeastBuild} from the LogicLib.

!include "WinVer.nsh"

!macro NSIS_HOOK_PREINSTALL
  ${IfNot} ${AtLeastBuild} 16299
    MessageBox MB_OK|MB_ICONSTOP "Alent.Red requires Windows 10 version 1709 (Fall Creators Update) or later."
    Abort
  ${EndIf}
!macroend
